import { supabase } from '../lib/supabase';

export interface Invoice {
    invoice_id: string;
    patient_id: string;
    invoice_date: string;
    total_amount: number;
    discount: number;
    status: 'Paid' | 'Pending' | 'Partial';
    created_at?: string;
}

export interface InvoiceItem {
    id?: number;
    invoice_id: string;
    service_name: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface InvoicePayment {
    payment_id?: number;
    invoice_id: string;
    payment_mode: string;
    paid_amount: number;
    payment_date: string;
}

export interface WalletTransaction {
    id?: number;
    patient_id: string;
    amount: number;
    type: 'credit' | 'debit';
    reason: string;
    created_at?: string;
}

export interface InvoiceWithDetails extends Invoice {
    items?: InvoiceItem[];
    payments?: InvoicePayment[];
    patient_name?: string;
    balance_due?: number;
}

class BillingService {
    // Generate unique invoice ID
    private generateInvoiceId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        return `INV${timestamp}${random}`.toUpperCase();
    }

    // Create invoice
    async createInvoice(data: {
        patient_id: string;
        items: Omit<InvoiceItem, 'invoice_id'>[];
        discount?: number;
    }): Promise<InvoiceWithDetails> {
        const invoiceId = this.generateInvoiceId();

        // Calculate total
        const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
        const discount = data.discount || 0;
        const finalAmount = totalAmount - discount;

        // Create invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert({
                invoice_id: invoiceId,
                patient_id: data.patient_id,
                invoice_date: new Date().toISOString().split('T')[0],
                total_amount: finalAmount,
                discount: discount,
                status: 'Pending'
            })
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // Add invoice items
        const items = data.items.map(item => ({
            ...item,
            invoice_id: invoiceId
        }));

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(items);

        if (itemsError) throw itemsError;

        return this.getInvoiceById(invoiceId) as Promise<InvoiceWithDetails>;
    }

    // Get invoice by ID
    async getInvoiceById(invoiceId: string): Promise<InvoiceWithDetails | null> {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        patients(full_name)
      `)
            .eq('invoice_id', invoiceId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        // Get invoice items
        const { data: items } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);

        // Get payments
        const { data: payments } = await supabase
            .from('invoice_payments')
            .select('*')
            .eq('invoice_id', invoiceId);

        const totalPaid = payments?.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0) || 0;
        const balanceDue = parseFloat(data.total_amount || 0) - totalPaid;

        return {
            ...data,
            items: items || [],
            payments: payments || [],
            patient_name: data.patients?.full_name,
            balance_due: balanceDue
        };
    }

    // Get invoices by patient
    async getInvoicesByPatient(patientId: string): Promise<InvoiceWithDetails[]> {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('patient_id', patientId)
            .order('invoice_date', { ascending: false });

        if (error) throw error;

        const invoices = await Promise.all(
            (data || []).map(async (inv: any) => {
                return this.getInvoiceById(inv.invoice_id);
            })
        );

        return invoices.filter(i => i !== null) as InvoiceWithDetails[];
    }

    // Record payment
    async recordPayment(payment: InvoicePayment): Promise<InvoicePayment> {
        const { data, error } = await supabase
            .from('invoice_payments')
            .insert(payment)
            .select()
            .single();

        if (error) throw error;

        // Update invoice status
        await this.updateInvoiceStatus(payment.invoice_id);

        // If payment mode is wallet, deduct from wallet
        if (payment.payment_mode === 'Wallet') {
            await this.deductFromWallet(
                payment.invoice_id,
                payment.paid_amount,
                `Payment for invoice ${payment.invoice_id}`
            );
        }

        return data;
    }

    // Update invoice status based on payments
    private async updateInvoiceStatus(invoiceId: string): Promise<void> {
        const invoice = await this.getInvoiceById(invoiceId);
        if (!invoice) return;

        let status: 'Paid' | 'Pending' | 'Partial' = 'Pending';

        if (invoice.balance_due === 0) {
            status = 'Paid';
        } else if (invoice.balance_due! < invoice.total_amount) {
            status = 'Partial';
        }

        await supabase
            .from('invoices')
            .update({ status })
            .eq('invoice_id', invoiceId);
    }

    // Get wallet balance
    async getWalletBalance(patientId: string): Promise<number> {
        const { data, error } = await supabase
            .from('patient_wallet')
            .select('balance')
            .eq('patient_id', patientId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Create wallet if doesn't exist
                await supabase
                    .from('patient_wallet')
                    .insert({ patient_id: patientId, balance: 0 });
                return 0;
            }
            throw error;
        }

        return parseFloat(data?.balance || 0);
    }

    // Add to wallet
    async addToWallet(patientId: string, amount: number, reason: string): Promise<WalletTransaction> {
        // Get current balance
        const currentBalance = await this.getWalletBalance(patientId);
        const newBalance = currentBalance + amount;

        // Update wallet
        const { error: walletError } = await supabase
            .from('patient_wallet')
            .upsert({
                patient_id: patientId,
                balance: newBalance
            });

        if (walletError) throw walletError;

        // Record transaction
        const { data, error } = await supabase
            .from('wallet_transactions')
            .insert({
                patient_id: patientId,
                amount: amount,
                type: 'credit',
                reason: reason
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Deduct from wallet
    private async deductFromWallet(patientId: string, amount: number, reason: string): Promise<WalletTransaction> {
        // Get current balance
        const currentBalance = await this.getWalletBalance(patientId);

        if (currentBalance < amount) {
            throw new Error('Insufficient wallet balance');
        }

        const newBalance = currentBalance - amount;

        // Update wallet
        const { error: walletError } = await supabase
            .from('patient_wallet')
            .update({ balance: newBalance })
            .eq('patient_id', patientId);

        if (walletError) throw walletError;

        // Record transaction
        const { data, error } = await supabase
            .from('wallet_transactions')
            .insert({
                patient_id: patientId,
                amount: amount,
                type: 'debit',
                reason: reason
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get wallet transactions
    async getWalletTransactions(patientId: string, limit?: number): Promise<WalletTransaction[]> {
        let query = supabase
            .from('wallet_transactions')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    // Get billing summary for patient
    async getBillingSummary(patientId: string) {
        const invoices = await this.getInvoicesByPatient(patientId);
        const walletBalance = await this.getWalletBalance(patientId);

        const totalBilled = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        const totalPaid = invoices
            .filter(inv => inv.status === 'Paid')
            .reduce((sum, inv) => sum + inv.total_amount, 0);
        const totalPending = invoices
            .filter(inv => inv.status === 'Pending' || inv.status === 'Partial')
            .reduce((sum, inv) => sum + (inv.balance_due || 0), 0);

        return {
            totalBilled,
            totalPaid,
            totalPending,
            walletBalance,
            invoiceCount: invoices.length
        };
    }
}

export const billingService = new BillingService();
