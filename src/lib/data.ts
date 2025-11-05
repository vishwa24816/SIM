import { BitcoinIcon, DogecoinIcon, EthereumIcon } from "@/components/icons";
import { CryptoCurrency, MutualFund, NewsArticle, CryptoETF } from "./types";
import { Coins, Package } from "lucide-react";

const generatePriceHistory = (base: number, days = 365) => {
  const history = [];
  let currentPrice = base;
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    // Add hourly fluctuations for the last day
    if (i === days - 1) {
      let hourlyPrice = history[history.length - 1]?.value || base * (1 + (Math.random() - 0.5) * 0.1);
      for (let j = 0; j < 24; j++) {
        history.push({
          time: new Date(date.getTime() - (23 - j) * 60 * 60 * 1000).toISOString(),
          value: hourlyPrice,
        });
        hourlyPrice *= (1 + (Math.random() - 0.49) * 0.02); // Tighter fluctuation for hours
      }
    } else {
       history.push({
        time: date.toISOString(),
        value: currentPrice,
      });
      currentPrice *= (1 + (Math.random() - 0.49) * 0.1); // Fluctuate by up to 10% daily
    }
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
    assetType: 'Spot',
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
    assetType: 'Spot',
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
    assetType: 'Spot',
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: Coins,
    price: 0.000017,
    change24h: 3.7,
    volume24h: 300000000,
    priceHistory: generatePriceHistory(0.000017),
    assetType: 'Spot',
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    icon: Coins,
    price: 0.47,
    change24h: 2.13,
    volume24h: 1200000000,
    priceHistory: generatePriceHistory(0.47),
    assetType: 'Spot',
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "TRX",
    icon: Coins,
    price: 0.11,
    change24h: 2.56,
    volume24h: 400000000,
    priceHistory: generatePriceHistory(0.11),
    assetType: 'Spot',
  },
  {
    id: "usd-coin",
    name: "USDCoin",
    symbol: "USDC",
    icon: Coins,
    price: 1.00,
    change24h: 0.00,
    volume24h: 5000000000,
    priceHistory: generatePriceHistory(1.00),
    assetType: 'Spot',
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    icon: Coins,
    price: 1.00,
    change24h: 0.00,
    volume24h: 50000000000,
    priceHistory: generatePriceHistory(1.00),
    assetType: 'Spot',
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    icon: Coins,
    price: 570.00,
    change24h: 0.89,
    volume24h: 1500000000,
    priceHistory: generatePriceHistory(570.00),
    assetType: 'Spot',
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    icon: Coins,
    price: 0.38,
    change24h: -2.17,
    volume24h: 350000000,
    priceHistory: generatePriceHistory(0.38),
    assetType: 'Spot',
  },
    {
    id: "notcoin",
    name: "Notcoin",
    symbol: "NOT",
    icon: Coins,
    price: 0.015,
    change24h: 25.00,
    volume24h: 1000000000,
    priceHistory: generatePriceHistory(0.015),
    assetType: 'Spot',
  },
  {
    id: "pepe",
    name: "Pepe",
    symbol: "PEPE",
    icon: Coins,
    price: 0.000011,
    change24h: 18.87,
    volume24h: 800000000,
    priceHistory: generatePriceHistory(0.000011),
    assetType: 'Spot',
  },
  {
    id: "dogwifhat",
    name: "dogwifhat",
    symbol: "WIF",
    icon: Coins,
    price: 2.50,
    change24h: 14.75,
    volume24h: 500000000,
    priceHistory: generatePriceHistory(2.50),
    assetType: 'Spot',
  },
  {
    id: "floki",
    name: "Floki",
    symbol: "FLOKI",
    icon: Coins,
    price: 0.00017,
    change24h: 12.00,
    volume24h: 200000000,
    priceHistory: generatePriceHistory(0.00017),
    assetType: 'Spot',
  },
  {
    id: "singularitynet",
    name: "SingularityNET",
    symbol: "AGIX",
    icon: Coins,
    price: 0.68,
    change24h: 9.20,
    volume24h: 150000000,
    priceHistory: generatePriceHistory(0.68),
    assetType: 'Web3',
  },
  {
    id: "apecoin",
    name: "ApeCoin",
    symbol: "APE",
    icon: Coins,
    price: 1.0,
    change24h: 4.2,
    volume24h: 50000000,
    priceHistory: generatePriceHistory(1.0),
    assetType: 'Web3',
  },
  {
    id: "the-sandbox",
    name: "The Sandbox",
    symbol: "SAND",
    icon: Coins,
    price: 0.33,
    change24h: 3.1,
    volume24h: 60000000,
    priceHistory: generatePriceHistory(0.33),
    assetType: 'Web3',
  },
  {
    id: "decentraland",
    name: "Decentraland",
    symbol: "MANA",
    icon: Coins,
    price: 0.33,
    change24h: 2.5,
    volume24h: 45000000,
    priceHistory: generatePriceHistory(0.33),
    assetType: 'Web3',
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: Coins,
    price: 150.0,
    change24h: 5.5,
    volume24h: 2000000000,
    priceHistory: generatePriceHistory(150.0),
    assetType: 'Spot',
  },
  {
    id: "uniswap",
    name: "Uniswap",
    symbol: "UNI",
    icon: Coins,
    price: 10.0,
    change24h: 6.2,
    volume24h: 250000000,
    priceHistory: generatePriceHistory(10.0),
    assetType: 'Web3',
  },
  {
    id: 'pancakeswap-token',
    name: 'PancakeSwap',
    symbol: 'CAKE',
    icon: Coins,
    price: 2.2,
    change24h: 1.8,
    volume24h: 40000000,
    priceHistory: generatePriceHistory(2.2),
    assetType: 'Web3',
  }
];

export const MUTUAL_FUNDS_DATA: MutualFund[] = [
  {
      id: 'crypto-innovators-fund',
      name: 'Crypto Innovators Fund Direct-Growth',
      symbol: 'CIF',
      icon: Package,
      nav: 2457.60,
      navDate: '2025-06-20',
      change1d: 3.02,
      change3y: 40.57,
      rating: 'NA',
      risk: 'Very High Risk',
      tags: ['Thematic', 'Thematic'],
      minSipAmount: 1000,
      fundSize: 504000000000, // 50,400 Cr
      about: 'An open-ended thematic mutual fund scheme investing in a diversified portfolio of companies that are participating in and benefiting from the crypto and blockchain innovation ecosystem.',
      fundManager: {
          name: 'Jane Crypto',
          title: 'Fund Manager',
          company: 'Digital Asset Ventures',
          bio: 'Jane is a pioneer in digital asset management with over 10 years of experience in the crypto space. She specializes in quantitative analysis and on-chain metrics to drive investment decisions.'
      },
      topHoldings: [
          { name: 'Bitcoin', symbol: 'BTC', percentage: 25.50 },
          { name: 'Ethereum', symbol: 'ETH', percentage: 20.20 },
          { name: 'Solana', symbol: 'SOL', percentage: 15.80 },
          { name: 'Render', symbol: 'RNDR', percentage: 10.10 },
          { name: 'Fetch.ai', symbol: 'FET', percentage: 8.40 },
      ],
      priceHistory: generatePriceHistory(2457.60),
  },
  {
    id: 'blue-chip-fund',
    name: 'Blue Chip Crypto Fund',
    symbol: 'BCCF',
    icon: Package,
    nav: 1200.50,
    navDate: '2025-06-20',
    change1d: 1.5,
    change3y: 35.2,
    rating: '4 Stars',
    risk: 'High Risk',
    tags: ['Large Cap'],
    minSipAmount: 500,
    fundSize: 75000000000,
    about: 'A fund focused on established, large-market-cap cryptocurrencies to provide stable, long-term growth.',
    fundManager: {
        name: 'John Stable',
        title: 'Senior Fund Manager',
        company: 'Crypto Capital Management',
        bio: 'John has a background in traditional finance and brings a disciplined, risk-averse approach to crypto investing.'
    },
    topHoldings: [
        { name: 'Bitcoin', symbol: 'BTC', percentage: 40.00 },
        { name: 'Ethereum', symbol: 'ETH', percentage: 30.00 },
        { name: 'BNB', symbol: 'BNB', percentage: 10.00 },
        { name: 'XRP', symbol: 'XRP', percentage: 10.00 },
        { name: 'Cardano', symbol: 'ADA', percentage: 10.00 },
    ],
    priceHistory: generatePriceHistory(1200.50),
  },
  {
    id: 'meme-coin-fund',
    name: 'Meme Coin Mania Fund',
    symbol: 'MEME',
    icon: Package,
    nav: 50.20,
    navDate: '2025-06-20',
    change1d: 12.5,
    change3y: 150.7,
    rating: 'NA',
    risk: 'Very High Risk',
    tags: ['Meme', 'Small Cap'],
    minSipAmount: 100,
    fundSize: 10000000000,
    about: 'A high-risk, high-reward fund investing in a portfolio of popular meme coins, aiming to capture explosive growth from viral trends.',
     fundManager: {
        name: 'Chad Viral',
        title: 'Chief Meme Officer',
        company: 'Degen Investments',
        bio: 'Chad lives and breathes internet culture. His strategy involves constantly monitoring social media trends to identify the next big meme coin.'
    },
    topHoldings: [
        { name: 'Dogecoin', symbol: 'DOGE', percentage: 30.00 },
        { name: 'Shiba Inu', symbol: 'SHIB', percentage: 25.00 },
        { name: 'Pepe', symbol: 'PEPE', percentage: 20.00 },
        { name: 'dogwifhat', symbol: 'WIF', percentage: 15.00 },
        { name: 'Floki', symbol: 'FLOKI', percentage: 10.00 },
    ],
    priceHistory: generatePriceHistory(50.20),
  }
];

export const CRYPTO_ETFS_DATA: CryptoETF[] = [
  {
    id: 'spot-btc-etf',
    name: 'SIM Bitcoin Trust',
    symbol: 'SIMBTC',
    icon: BitcoinIcon,
    price: 68.50,
    change24h: 2.6,
    volume24h: 1500000000,
    priceHistory: generatePriceHistory(68.50),
    issuer: 'SIM Investments',
    inceptionDate: '2024-01-11',
    expenseRatio: 0.19,
    aum: 20000000000, // 20B
    description: 'The SIM Bitcoin Trust (SIMBTC) is an exchange-traded fund that directly holds Bitcoin, offering investors a regulated and straightforward way to gain exposure to the price movements of BTC without needing to own the cryptocurrency itself.',
    underlyingAssets: [
      { name: 'Bitcoin', symbol: 'BTC', weight: 100.00 }
    ],
  },
  {
    id: 'spot-eth-etf',
    name: 'SIM Ethereum Trust',
    symbol: 'SIMETH',
    icon: EthereumIcon,
    price: 35.80,
    change24h: -1.1,
    volume24h: 800000000,
    priceHistory: generatePriceHistory(35.80),
    issuer: 'SIM Investments',
    inceptionDate: '2024-05-23',
    expenseRatio: 0.21,
    aum: 5000000000, // 5B
    description: 'The SIM Ethereum Trust (SIMETH) provides direct exposure to Ethereum, the second-largest cryptocurrency by market capitalization. The ETF allows investors to participate in ETH\'s potential growth through a traditional brokerage account.',
    underlyingAssets: [
      { name: 'Ethereum', symbol: 'ETH', weight: 100.00 }
    ],
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
