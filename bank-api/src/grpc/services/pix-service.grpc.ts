import { Observable } from 'rxjs';

interface PixKeyRegistration {
  kind: string;
  key: string;
  accountId: string;
}

interface PixKeyRegistrationResult {
  id: string;
  status: string;
  error: string;
}

interface PixKey {
  kind: string;
  key: string;
}

interface Account {
  accountId: string;
  accountNumber: string;
  bankId: string;
  bankName: string;
  ownerName: string;
  createdAt: string;
}

interface PixKeyInfo {
  id: string;
  kind: string;
  key: string;
  account: Account;
  createdAt: string;
}

export interface PixService {
  registerPixKey: (
    data: PixKeyRegistration,
  ) => Observable<PixKeyRegistrationResult>;

  find: (data: PixKey) => Observable<PixKeyInfo>;
}
