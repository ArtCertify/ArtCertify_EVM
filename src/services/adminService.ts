/**
 * Stub admin service for EVM app. The Algorand backend admin (Keycloak, organizations CRUD)
 * is not used on Base; this module exists only to satisfy AdminPage imports.
 */

export interface Organization {
  address: string;
  name: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  enabled?: boolean;
  updatedAt?: string;
}

export interface CreateOrganizationRequest {
  address: string;
  name: string;
  description: string;
  website: string;
  contactEmail: string;
  enabled: boolean;
}

const adminService = {
  isAdminAuthenticated(): boolean {
    return false;
  },

  async loginWithKeycloak(_username: string, _password: string): Promise<void> {
    throw new Error('Admin panel non disponibile in questa versione (solo EVM).');
  },

  clearAdminTokens(): void {
    // no-op
  },

  async getOrganizations(): Promise<Organization[]> {
    return [];
  },

  async createOrganization(_data: CreateOrganizationRequest): Promise<void> {
    throw new Error('Admin panel non disponibile in questa versione (solo EVM).');
  },

  async deleteOrganization(_address: string): Promise<void> {
    throw new Error('Admin panel non disponibile in questa versione (solo EVM).');
  },
};

export { adminService };
