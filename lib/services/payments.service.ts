/**
 * Service de pagamentos - implementa todos os endpoints de payments da documentação
 * Refatorado para usar httpClient centralizado com autenticação
 */

import { httpClient, ApiResponse } from '../httpClient';

export interface PaymentQrCodeData {
  qrCode: string;
  qrCodeUrl: string;
  externalId: string;
  amount: number; // decimal
  expiresAt: string; // datetime
}

export interface PaymentResponse {
  success: boolean;
  data: PaymentQrCodeData;
  error: any;
}

export class PaymentsService {
  /**
   * POST /api/payments
   * Cria um QR Code PIX para pagamento
   */
  static async createPayment(): Promise<ApiResponse<PaymentQrCodeData>> {
    return httpClient.post<PaymentQrCodeData>('/api/payments');
  }
}

/**
 * Service de webhooks - implementa endpoint de webhook (apenas para referência)
 * Este service geralmente não seria usado pelo frontend
 */

export interface WebhookEvent {
  event: string;
  data: {
    pixQrCode: {
      id: string;
      status: string;
      amount: number; // decimal
    };
  };
}

export class WebhooksService {
  /**
   * POST /api/webhooks/abacatepay
   * Recebe notificações de webhook do AbacatePay
   * Nota: Este endpoint geralmente não seria chamado pelo frontend
   */
  static async receiveAbacatePayWebhook(data: WebhookEvent): Promise<void> {
    // Esta função é apenas para completude da documentação
    // Normalmente webhooks são chamados diretamente pelo gateway de pagamento
    // Para webhook, usa authRequest pois não requer autenticação (AllowAnonymous)
    await httpClient.authRequest<void>('/api/webhooks/abacatepay', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}