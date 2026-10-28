// server/src/services/chaosService.js
// Allows dynamic simulation of API outages, rate limits, and network latency for live interview demonstration

class ChaosService {
  constructor() {
    this.config = {
      failCrm: false,
      failHelpdesk: false,
      latencyMs: 0,
      crmErrorType: 500, // 500, 503, 429
      helpdeskErrorType: 503
    };
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  reset() {
    this.config = {
      failCrm: false,
      failHelpdesk: false,
      latencyMs: 0,
      crmErrorType: 500,
      helpdeskErrorType: 503
    };
    return this.config;
  }

  async applyLatency() {
    if (this.config.latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.config.latencyMs));
    }
  }

  checkCrmFailure() {
    if (this.config.failCrm) {
      const error = new Error(`Simulated CRM Service Error: HTTP ${this.config.crmErrorType}`);
      error.status = this.config.crmErrorType;
      throw error;
    }
  }

  checkHelpdeskFailure() {
    if (this.config.failHelpdesk) {
      const error = new Error(`Simulated Helpdesk Service Error: HTTP ${this.config.helpdeskErrorType}`);
      error.status = this.config.helpdeskErrorType;
      throw error;
    }
  }
}

export const chaosService = new ChaosService();
