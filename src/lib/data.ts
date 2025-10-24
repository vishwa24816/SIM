import { BitcoinIcon, DogecoinIcon, EthereumIcon } from "@/components/icons";
import { CryptoCurrency, NewsArticle } from "./types";

const generatePriceHistory = (base: number) => {
  const history = [];
  let currentPrice = base;
  for (let i = 0; i < 30; i++) {
    history.push({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: currentPrice,
    });
    currentPrice *= (1 + (Math.random() - 0.49) * 0.1); // Fluctuate by up to 10%
  }
  return history;
};


export const INITIAL_CRYPTO_DATA: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: BitcoinIcon,
    price: 68134.32,
    change24h: 2.5,
    volume24h: 34500000000,
    priceHistory: generatePriceHistory(68134.32),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: EthereumIcon,
    price: 3567.89,
    change24h: -1.2,
    volume24h: 18200000000,
    priceHistory: generatePriceHistory(3567.89),
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    icon: DogecoinIcon,
    price: 0.16,
    change24h: 5.8,
    volume24h: 2100000000,
    priceHistory: generatePriceHistory(0.16),
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
    {
      id: 1,
      title: "Bitcoin ETFs See Record Inflows as Institutions Pile In",
      source: "CryptoNews Daily",
      published: "2 hours ago",
      url: "#",
      content: "Spot Bitcoin ETFs have experienced a surge in capital inflows this week, with major financial institutions increasing their holdings. Analysts suggest this renewed institutional interest is a primary driver behind Bitcoin's recent price rally towards the $70,000 mark. The trend indicates a growing acceptance of cryptocurrency as a legitimate asset class among traditional investors."
    },
    {
      id: 2,
      title: "Ethereum's 'Pectra' Upgrade: What to Expect",
      source: "ETH Hub",
      published: "8 hours ago",
      url: "#",
      content: "The Ethereum community is buzzing with anticipation for the upcoming 'Pectra' network upgrade. This upgrade is expected to introduce several key improvements, including EIP-3074, which will enhance smart contract capabilities and user experience by allowing externally owned accounts (EOAs) to delegate control to a contract. This could simplify transactions and enable new DeFi functionalities."
    },
    {
      id: 3,
      title: "Meme Coin Mania Cools Down, But Dogecoin Holds Strong",
      source: "The Coin Telegraph",
      published: "1 day ago",
      url: "#",
      content: "The recent frenzy around meme coins appears to be subsiding, with many smaller tokens seeing significant price corrections. However, established players like Dogecoin have shown resilience, maintaining a relatively stable price and strong community support. This suggests a potential flight to 'quality' even within the highly volatile meme coin sector."
    },
     {
      id: 4,
      title: "Regulatory Landscape for Crypto Shifts in Europe",
      source: "Global Finance",
      published: "2 days ago",
      url: "#",
      content: "European Union regulators are finalizing the implementation of the Markets in Crypto-Assets (MiCA) framework. The new rules aim to provide a clear legal structure for crypto service providers and issuers, enhancing consumer protection and market integrity. While some in the industry have raised concerns about compliance costs, the overall sentiment is that regulatory clarity will foster long-term growth and stability in the European crypto market."
    }
  ];
