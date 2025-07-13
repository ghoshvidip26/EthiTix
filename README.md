<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <img width="60" height="60" alt="Logo" src="https://github.com/user-attachments/assets/a1a6cb89-925c-44bf-b200-716d7fcf015f" />
  <h1 style="margin: 0;">EthiTix</h1>
</div>

<p align="center"><b>Organize Smart. Approve Fast.</b></p>
<p align="center">
  A decentralized event ticketing and management platform powered by the Aptos blockchain, designed to eliminate ticket fraud and streamline event access.
</p>


---

<img width="1680" height="772" alt="Screenshot 2025-07-12 at 18 22 39" src="https://github.com/user-attachments/assets/e8f5dab0-38b1-4356-ac96-abf4629316be" />
<img width="1667" height="811" alt="Screenshot 2025-07-13 at 14 46 13" src="https://github.com/user-attachments/assets/79a845b8-0e3a-4789-bb0d-355d0990041b" />
<img width="1680" height="817" alt="Screenshot 2025-07-13 at 14 45 49" src="https://github.com/user-attachments/assets/7c681b52-459d-4c32-ba9e-2767ce0d773d" />

## 💡 The Problem

Traditional event ticketing is plagued with issues that frustrate both organizers and attendees. Organizers face:

- **❌ Black Market Sales:** Rampant black ticket selling and unauthorized resales inflate prices and create unfair access, as seen in major events like the Ahmedabad Coldplay concert.
- **❌ Fraud & Forgery:** Fake registrations, counterfeit tickets, and identity fraud lead to security risks and revenue loss.
- **❌ Lack of Transparency:** There is no verifiable, on-chain proof of participation, making records difficult to audit and trust.
- **❌ Disconnected Systems:** Organizers often juggle multiple, disconnected tools for managing registrations, verifying participants, and granting access.

## ✨ Our Solution: EthiTix

**EthiTix** is a seamless, secure, and transparent solution that leverages the power of the Aptos blockchain to revolutionize event management.

Our platform prevents black marketing by issuing wallet-bound, QR-based tickets that provide verifiable, on-chain proof of access. We streamline the entire event lifecycle—from creation and registration to approval and check-in—all within a single, decentralized application.

- ✅ **On-Chain Verification:** Participant approvals are transparently recorded on Aptos, creating an immutable and verifiable ledger.
- ✅ **Ethical Ticketing:** Fair and rule-based ticketing ensures no scalping or unfair resales. All rules are enforced by smart contracts.
- ✅ **QR-Powered Access:** Soulbound (non-transferable) QR codes are tied directly to an attendee's wallet, making them easy to scan and impossible to fake.

## 🚀 Key Features

- **Wallet-Based Identity:** Users register with their Aptos wallet, creating a secure and unique digital identity for event participation.
- **Admin Control Panel:** Event organizers can effortlessly create new events, set participation limits, and manage all event details.
- **On-Chain Approval System:** Admins approve participants directly via a smart contract, ensuring every approval is recorded and transparent.
- **User Dashboard:** Attendees can browse and register for upcoming events with a simple, intuitive interface.
- **Secure & Unique QR Codes:** Upon approval, each participant receives a unique QR code for entry, preventing duplication and unauthorized access.
- **Built on Aptos:** Utilizes the speed, low cost, and security of the Aptos blockchain for a superior user experience.

## gallery

| Landing Page                                                                                                                                                                    | Create Event (Admin)                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<p align="center">`The main entry point, outlining the core value propositions of the platform.`</p><img src="https://i.imgur.com/7w8rQzP.png" alt="Landing Page">`            | `<p align="center">`Admin interface for creating and publishing new events on the blockchain.`</p><img src="https://i.imgur.com/4lX3n4N.png" alt="Create Event Page">` |
| **Approve Participants (Admin)**                                                                                                                                                | **Event Dashboard (User)**                                                                                                                                             |
| `<p align="center">`Admins can review and approve registered participants with a single click.`</p><img src="https://i.imgur.com/Bf2wK7d.png" alt="Approve Participants Page">` | `<p align="center">`Users can view and register for available events.`</p><img src="https://i.imgur.com/XF8k2eY.png" alt="User Dashboard">`                            |

## ⚙️ How It Works

### Admin Flow

1. **Connect Wallet:** The admin connects their Aptos wallet (e.g., Petra).
2. **Initialize Registry:** On first use, the admin initializes the smart contract registry.
3. **Create Event:** The admin fills in event details (name, date, location, max participants) and publishes it to the blockchain.
4. **Approve Participants:** As users register, they appear in the admin's approval queue. The admin verifies and approves them, triggering an on-chain transaction.

### User Flow

1. **Connect Wallet:** An attendee connects their Aptos wallet.
2. **Browse Events:** They view the list of available events on their dashboard.
3. **Register:** They click "Register" for their desired event, submitting their wallet address for approval.
4. **Get Approved:** Once the admin approves their registration, their status is updated on-chain.
5. **Receive QR Code:** Upon approval, a unique, non-transferable QR code is generated, which serves as their ticket for entry.

## 🔧 Tech Stack

- **Blockchain:** [Aptos](https://aptos.dev/)
- **Smart Contracts:** [Move](https://move-language.com/)
- **Frontend:** [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Wallet Integration:** Aptos Wallet Adapter

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or later)
- `yarn` or `npm`
- [Aptos (Petra) Wallet](https://petra.app/) browser extension

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/EthiTix.git
   cd EthiTix
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the necessary environment variables.

   ```env
   NEXT_PUBLIC_APTOS_NODE_URL="https://fullnode.devnet.aptoslabs.com/v1"
   NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."
   ```

4. **Deploy the Smart Contract:**
   Instructions for deploying the Move contract to the Aptos blockchain.
   _(You can add specific CLI commands here)_
5. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗺️ Roadmap

- [ ] **Enhanced Admin Analytics:** A dashboard with insights on registration trends and participant demographics.
- [ ] **Secondary Marketplace:** A controlled, rule-based secondary market where users can trade tickets at a capped price to prevent scalping.
- [ ] **NFT as Tickets:** Issue tickets as collectible NFTs, providing attendees with a digital souvenir.
- [ ] **Real-time Notifications:** Notify users via email or in-app when their registration is approved.
- [ ] **Mobile QR Scanner App:** A dedicated mobile app for event staff to scan and validate QR codes at the venue.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information
