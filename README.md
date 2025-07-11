# ArtCertify - Safe Passkey Demo

Un'applicazione React moderna che integra la funzionalità passkey con Safe Wallet, utilizzando un design atomico con Tailwind CSS.

## 🚀 Funzionalità

- **Gestione Passkey**: Crea, autentica e gestisci passkey utilizzando l'API WebAuthn
- **Integrazione Safe**: Crea e gestisci wallet Safe utilizzando passkey come metodo di autenticazione
- **Design Atomico**: Componenti modulari e riutilizzabili
- **UI Moderna**: Interfaccia utente pulita e responsive con Tailwind CSS
- **TypeScript**: Tipizzazione completa per una migliore esperienza di sviluppo

## 📋 Prerequisiti

- Node.js (versione 18 o superiore)
- Un browser moderno che supporta WebAuthn (Chrome, Firefox, Safari, Edge)
- Dispositivo con autenticazione biometrica (Touch ID, Face ID, Windows Hello)

## 🛠️ Installazione

1. Clona il repository:
```bash
git clone <repository-url>
cd ArtCertify_EVM
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri il browser e vai a `http://localhost:5173`

## 🏗️ Architettura

### Struttura del Progetto

```
src/
├── components/
│   ├── atoms/           # Componenti atomici base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Spinner.tsx
│   │   ├── Alert.tsx
│   │   └── index.ts
│   ├── molecules/       # Componenti molecolari
│   └── organisms/       # Componenti organici
├── hooks/
│   ├── usePasskey.ts    # Hook per gestione passkey
│   └── useSafe.ts       # Hook per gestione Safe
├── types/
│   ├── passkey.ts       # Tipi TypeScript per passkey
│   └── safe.ts          # Tipi TypeScript per Safe
├── utils/
│   ├── passkey.ts       # Utility per passkey
│   └── safe.ts          # Utility per Safe
└── App.tsx              # Componente principale
```

### Componenti Atomici

- **Button**: Bottone riutilizzabile con varianti e stati
- **Card**: Contenitore per raggruppare contenuti
- **Input**: Campo di input con validazione
- **Spinner**: Indicatore di caricamento
- **Alert**: Componente per messaggi di feedback

### Hooks Personalizzati

- **usePasskey**: Gestisce la creazione, autenticazione e rimozione di passkey
- **useSafe**: Gestisce la configurazione e le operazioni del wallet Safe

## 🔐 Funzionalità Passkey

L'applicazione utilizza l'API WebAuthn per:

1. **Creazione Passkey**: Crea nuove passkey utilizzando l'autenticazione biometrica
2. **Autenticazione**: Autentica l'utente con passkey esistenti
3. **Gestione**: Visualizza, rimuove e gestisce passkey salvate localmente

### Supporto Browser

- ✅ Chrome 67+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+

## 🔒 Integrazione Safe

L'app integra la funzionalità Safe per:

1. **Creazione Wallet**: Crea un nuovo wallet Safe utilizzando passkey come owner
2. **Gestione**: Visualizza informazioni del wallet Safe
3. **Transazioni**: Firma messaggi e transazioni utilizzando passkey

### Reti Supportate

- **Sepolia Testnet** (predefinita)
- **Ethereum Mainnet**

## 🎨 Design System

L'applicazione utilizza un design system basato su:

- **Atomic Design**: Metodologia di progettazione modulare
- **Tailwind CSS**: Framework CSS utility-first
- **Responsive Design**: Compatibile con tutti i dispositivi
- **Accessibilità**: Conforme alle linee guida WCAG

### Palette Colori

```css
Primary: #3b82f6 (Blue)
Secondary: #64748b (Slate)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

## 📱 Utilizzo

### 1. Creazione Passkey

1. Clicca su "Create First Passkey"
2. Inserisci username e display name
3. Clicca "Create Passkey"
4. Completa l'autenticazione biometrica

### 2. Creazione Safe Wallet

1. Assicurati di aver creato almeno una passkey
2. Clicca su "Create Safe Wallet"
3. Attendi il completamento del deployment
4. Visualizza le informazioni del wallet

### 3. Autenticazione

1. Seleziona una passkey esistente
2. Clicca "Authenticate"
3. Completa l'autenticazione biometrica
4. Ricevi conferma dell'autenticazione

## 🔧 Configurazione

### Variabili di Ambiente

Crea un file `.env` nella root del progetto:

```env
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_SAFE_SERVICE_URL=https://safe-transaction-sepolia.safe.global
VITE_NETWORK=sepolia
```

### Personalizzazione

Per personalizzare l'applicazione:

1. **Colori**: Modifica `tailwind.config.js`
2. **Componenti**: Aggiungi nuovi componenti in `src/components/`
3. **Reti**: Modifica `src/utils/safe.ts`
4. **Storage**: Personalizza le chiavi di localStorage

## 🧪 Testing

Per testare l'applicazione:

1. **Manuale**: Utilizza l'interfaccia web
2. **Browser**: Testa su diversi browser
3. **Dispositivi**: Verifica il responsive design

### Requisiti per il Testing

- Dispositivo con autenticazione biometrica
- Browser con supporto WebAuthn
- Connessione HTTPS (o localhost)

## 📚 Risorse

- [Safe Documentation](https://docs.safe.global/)
- [WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

## 🐛 Troubleshooting

### Problemi Comuni

1. **WebAuthn non supportato**: Aggiorna il browser
2. **Passkey non funziona**: Verifica l'autenticazione biometrica
3. **Safe non si deploya**: Controlla la connessione di rete
4. **Errori di CORS**: Utilizza HTTPS o localhost

### Debug

Per abilitare il debug:

```javascript
// Nella console del browser
localStorage.setItem('debug', 'true');
```

## 🤝 Contribuire

1. Fork il repository
2. Crea un branch per la tua feature
3. Commit le modifiche
4. Push al branch
5. Crea una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 👥 Autori

- **Andrea Ritondale** - Sviluppatore principale

## 🙏 Ringraziamenti

- [Safe Global](https://safe.global/) per l'ecosistema Safe
- [WebAuthn Community](https://webauthn.io/) per le risorse
- [Tailwind CSS](https://tailwindcss.com/) per il framework CSS

---

**Nota**: Questa è una demo e non dovrebbe essere utilizzata in produzione senza ulteriori test e validazioni di sicurezza.
