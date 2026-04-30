import type { Question } from "../types/question";

export const LEGACY_QUESTION_POOLS = {
  "basic": [
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-1",
      "question": "Which of the following is a debt security?",
      "options": [
        "Common stock",
        "Corporate bond",
        "Preferred stock",
        "Warrant"
      ],
      "correct": 1,
      "explanation": "A corporate bond is a debt security representing a loan from investor to issuer. Bonds pay interest and return principal at maturity. Common stock, preferred stock, and warrants are equity-related instruments.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-2",
      "question": "A Treasury bill (T-bill) differs from a Treasury note because a T-bill:",
      "options": [
        "Pays semi-annual interest",
        "Matures in 10 years or more",
        "Is sold at a discount and matures in one year or less",
        "Is backed by gold reserves"
      ],
      "correct": 2,
      "explanation": "T-bills are short-term government obligations maturing in one year or less. They are issued at a discount — the difference between purchase price and face value is the return. T-notes pay semi-annual interest and mature in 2–10 years.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-3",
      "question": "Which bond type is backed by specific physical assets of the issuer?",
      "options": [
        "Debenture",
        "Mortgage bond",
        "Convertible bond",
        "Zero-coupon bond"
      ],
      "correct": 1,
      "explanation": "A mortgage bond is secured by specific real property or equipment. A debenture is unsecured. Convertible bonds can be exchanged for stock. Zero-coupon bonds pay no periodic interest.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-4",
      "question": "What is the par value of most corporate bonds?",
      "options": [
        "$100",
        "$500",
        "$1,000",
        "$10,000"
      ],
      "correct": 2,
      "explanation": "The standard par (face) value of most corporate bonds is $1,000. Bonds are quoted as a percentage of par — a bond quoted at 95 trades at $950.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-5",
      "question": "A convertible bond gives the holder the right to:",
      "options": [
        "Sell the bond back at par",
        "Convert into a fixed number of common shares",
        "Receive variable interest",
        "Extend the maturity date"
      ],
      "correct": 1,
      "explanation": "Convertible bonds contain an embedded option allowing the holder to convert into a predetermined number of common shares. This benefits investors if the stock price rises above the conversion price.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-6",
      "question": "Which of the following is characteristic of preferred stock?",
      "options": [
        "Voting rights in all elections",
        "Dividends paid before common stockholders",
        "Unlimited upside participation",
        "FDIC insurance"
      ],
      "correct": 1,
      "explanation": "Preferred stockholders have priority over common stockholders in dividend payments and in liquidation. Preferred stock generally does not carry voting rights and has limited price appreciation.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-7",
      "question": "A mutual fund that constantly issues new shares at NAV is called:",
      "options": [
        "A closed-end fund",
        "An open-end fund",
        "An exchange-traded fund",
        "A unit investment trust"
      ],
      "correct": 1,
      "explanation": "An open-end mutual fund continuously issues new shares and redeems existing shares at the fund's NAV calculated at end of day. Closed-end funds trade on exchanges at market prices that may differ from NAV.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-8",
      "question": "NAV stands for Net Asset Value. How is it calculated?",
      "options": [
        "Total Liabilities / Shares Outstanding",
        "(Total Assets − Total Liabilities) / Shares Outstanding",
        "Total Revenue / Shares Outstanding",
        "Market Price × Shares Outstanding"
      ],
      "correct": 1,
      "explanation": "NAV = (Total Assets − Total Liabilities) / Shares Outstanding. For open-end mutual funds, NAV is calculated once daily after markets close.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-9",
      "question": "Which type of security represents an ownership interest in a corporation?",
      "options": [
        "Corporate bond",
        "Treasury note",
        "Common stock",
        "Certificate of deposit"
      ],
      "correct": 2,
      "explanation": "Common stock represents an equity (ownership) interest in a corporation. Stockholders may vote on major corporate decisions and receive dividends. Bonds and CDs are debt instruments.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-10",
      "question": "A zero-coupon bond:",
      "options": [
        "Pays interest monthly",
        "Pays no periodic interest and is issued at a deep discount",
        "Converts to stock at maturity",
        "Has a floating interest rate"
      ],
      "correct": 1,
      "explanation": "Zero-coupon bonds pay no periodic interest. They are issued at a deep discount to face value and the investor receives the full face value at maturity. The difference represents the return. They have the highest interest rate sensitivity (duration) of any bond type.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-11",
      "question": "Which of the following is an equity security?",
      "options": [
        "Corporate bond",
        "Commercial paper",
        "Common stock",
        "T-bill"
      ],
      "correct": 2,
      "explanation": "Common stock is an equity security — it represents ownership in a corporation. Bonds, commercial paper, and T-bills are all debt instruments that represent loans to the issuer.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-12",
      "question": "A warrant gives the holder the right to:",
      "options": [
        "Receive a dividend",
        "Purchase common stock at a specified price within a set time period",
        "Sell stock at a specified price",
        "Convert debt to equity"
      ],
      "correct": 1,
      "explanation": "A warrant gives the holder the right to purchase common stock at a specified (exercise) price within a specified period. Warrants are often attached to bonds or preferred stock as a sweetener and are traded separately after issuance.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-13",
      "question": "What is a debenture?",
      "options": [
        "A bond secured by specific collateral",
        "An unsecured bond backed only by the issuer's creditworthiness",
        "A type of preferred stock",
        "A government savings bond"
      ],
      "correct": 1,
      "explanation": "A debenture is an unsecured bond. It is backed only by the general credit and reputation of the issuer — not by specific collateral. Because they carry more credit risk than secured bonds, debentures typically pay higher interest rates.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-14",
      "question": "American Depositary Receipts (ADRs) allow U.S. investors to:",
      "options": [
        "Buy foreign company shares traded on U.S. exchanges in U.S. dollars",
        "Avoid paying taxes on foreign dividends",
        "Access government bonds from foreign countries",
        "Invest in commodity futures"
      ],
      "correct": 0,
      "explanation": "ADRs are certificates issued by U.S. banks representing shares of foreign companies. They trade on U.S. exchanges in U.S. dollars, allowing American investors to invest in foreign companies without dealing with foreign currency or exchanges directly.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-15",
      "question": "Which of the following best describes a Treasury STRIP?",
      "options": [
        "A variable-rate Treasury note",
        "A zero-coupon instrument created by separating coupon payments from a Treasury bond",
        "A Treasury bond with a call provision",
        "An inflation-protected Treasury security"
      ],
      "correct": 1,
      "explanation": "STRIPS (Separate Trading of Registered Interest and Principal of Securities) are created when a Treasury bond is separated into its individual coupon payments and principal repayment, each traded as a zero-coupon security. They are popular for immunizing specific future liabilities.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-16",
      "question": "The primary market is where:",
      "options": [
        "The largest stock exchange operates",
        "Previously issued securities are bought and sold",
        "New securities are originally issued to investors",
        "Only government bonds trade"
      ],
      "correct": 2,
      "explanation": "The primary market is where new securities are first sold to investors — IPOs and new bond issuances. Proceeds go directly to the issuer. Once issued, securities trade among investors in the secondary market.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-17",
      "question": "Which organization self-regulates broker-dealers in the U.S.?",
      "options": [
        "The Federal Reserve",
        "FINRA",
        "The U.S. Treasury",
        "The FDIC"
      ],
      "correct": 1,
      "explanation": "FINRA is a non-governmental self-regulatory organization (SRO) that oversees broker-dealers and their registered representatives. It writes and enforces rules, conducts exams, and disciplines members under SEC oversight.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-18",
      "question": "What is the role of a market maker?",
      "options": [
        "Set interest rates for bonds",
        "Provide liquidity by quoting bid and ask prices and standing ready to buy or sell",
        "Audit broker-dealer statements",
        "Guarantee investor returns"
      ],
      "correct": 1,
      "explanation": "Market makers provide liquidity by continuously quoting bid (buy) and ask (sell) prices. They profit from the spread. Their continuous presence ensures investors can buy or sell without waiting for a matching counterparty.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-19",
      "question": "The bid-ask spread refers to:",
      "options": [
        "The geographic reach of a broker-dealer",
        "The difference between the bid price and the ask price",
        "The annual management fee of a mutual fund",
        "A stock's 52-week price range"
      ],
      "correct": 1,
      "explanation": "The bid-ask spread is the difference between the highest price a buyer will pay (bid) and the lowest a seller will accept (ask). It represents the market maker's compensation. Narrow spreads indicate liquid, actively traded securities.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-20",
      "question": "Which exchange is the largest equity market in the world by market capitalization?",
      "options": [
        "NASDAQ",
        "NYSE",
        "London Stock Exchange",
        "Tokyo Stock Exchange"
      ],
      "correct": 1,
      "explanation": "The New York Stock Exchange (NYSE) is the largest equity market in the world by total market capitalization of listed companies. NASDAQ is the second largest and is known for listing many technology companies.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-21",
      "question": "An OTC (Over-the-Counter) market differs from an exchange in that:",
      "options": [
        "OTC markets have no regulations",
        "OTC trading occurs directly between parties via dealer networks rather than on a centralized exchange floor",
        "OTC markets only handle government securities",
        "OTC trading is only available to institutions"
      ],
      "correct": 1,
      "explanation": "OTC markets are decentralized — trading occurs directly between parties through dealer networks (like FINRA's OTC Bulletin Board or the Pink Sheets). Major exchanges like NYSE and NASDAQ are centralized, with specific listing requirements.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-22",
      "question": "What is the function of a clearinghouse in securities transactions?",
      "options": [
        "To set the opening price for securities each day",
        "To guarantee settlement of trades and reduce counterparty risk",
        "To determine which companies may list on exchanges",
        "To regulate broker-dealer conduct"
      ],
      "correct": 1,
      "explanation": "A clearinghouse (like DTCC) sits between buyers and sellers, guaranteeing completion of trades and reducing counterparty risk. It handles the settlement process — transferring securities and cash between parties. In the U.S., most equity trades settle T+1 (one business day after trade).",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-23",
      "question": "Which of the following best describes the \"third market\"?",
      "options": [
        "Trading of exchange-listed securities OTC between institutions",
        "Trading of OTC securities on an exchange",
        "International securities markets",
        "After-hours trading on ECNs"
      ],
      "correct": 0,
      "explanation": "The third market refers to the trading of exchange-listed securities over-the-counter among institutional investors and broker-dealers. This allows large block trades outside the exchange, often at better prices. The fourth market is direct trading between institutions without broker-dealers.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-24",
      "question": "A \"block trade\" typically refers to a transaction involving:",
      "options": [
        "At least 100 shares",
        "At least 10,000 shares or $200,000 in value",
        "Any trade over $1,000,000",
        "A trade of exactly 1,000 shares"
      ],
      "correct": 1,
      "explanation": "A block trade is generally defined as a transaction involving at least 10,000 shares or $200,000 in market value. Block trades are typically executed by institutional investors and may be handled differently to minimize market impact.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-25",
      "question": "A JTWROS account means:",
      "options": [
        "Each tenant can only access their proportional share",
        "Upon death, the surviving tenant receives the deceased's share automatically",
        "A court must approve all transactions",
        "Each owner files a separate tax return"
      ],
      "correct": 1,
      "explanation": "In a JTWROS (Joint Tenants with Right of Survivorship) account, all owners have equal, undivided interest. Upon death, the deceased's interest automatically transfers to the surviving owner(s), bypassing probate. This differs from Tenants in Common where a deceased owner's share passes through their estate.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-26",
      "question": "A custodial account (UGMA/UTMA) for a minor is controlled by:",
      "options": [
        "The minor child",
        "The custodian, until the minor reaches the age of majority",
        "A court-appointed trustee",
        "FINRA"
      ],
      "correct": 1,
      "explanation": "UGMA/UTMA custodial accounts are managed by an adult custodian for the benefit of a minor. Once the minor reaches the age of majority (18–25 depending on state), the assets transfer irrevocably to them.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-27",
      "question": "Which account type has the fewest restrictions for an experienced investor?",
      "options": [
        "IRA",
        "Cash account",
        "401(k)",
        "529 plan"
      ],
      "correct": 1,
      "explanation": "A standard cash account (Type 1) requires full payment for securities by settlement date. It has no special restrictions beyond cash availability. IRAs and 401(k)s have contribution limits and withdrawal restrictions; 529s are for education expenses.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-28",
      "question": "Suitability requires a registered representative to:",
      "options": [
        "Recommend the most expensive product",
        "Have reasonable grounds that a recommendation fits the customer's profile",
        "Recommend only government securities",
        "Match recommendations to the firm's inventory"
      ],
      "correct": 1,
      "explanation": "Suitability (FINRA Rule 2111) requires that a registered rep have a reasonable basis to believe a recommendation is suitable based on the customer's financial situation, risk tolerance, investment objectives, and experience.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-29",
      "question": "A new customer account form must be updated when:",
      "options": [
        "A new broker joins the firm",
        "There is a material change in the customer's financial situation or objectives",
        "The market rises more than 10%",
        "The customer turns 50"
      ],
      "correct": 1,
      "explanation": "FINRA requires customer account information be kept current. Firms must make reasonable efforts to update records when a material change occurs — such as retirement, job loss, inheritance, or change in investment objectives.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-30",
      "question": "A discretionary account allows the broker to:",
      "options": [
        "Guarantee returns to the customer",
        "Execute trades without prior customer approval for each trade",
        "Charge unlimited commissions",
        "Invest only in government securities"
      ],
      "correct": 1,
      "explanation": "A discretionary account gives a broker or investment adviser authority to make trading decisions — choosing the security, number of shares, and timing — without customer approval for each individual trade. A written discretionary authorization (limited power of attorney) is required.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-31",
      "question": "Under the pattern day trader (PDT) rule, an account making 4+ day trades in 5 business days must maintain minimum equity of:",
      "options": [
        "$2,000",
        "$10,000",
        "$25,000",
        "$50,000"
      ],
      "correct": 2,
      "explanation": "FINRA Rule 4210 designates any customer making 4 or more day trades in 5 business days as a pattern day trader. PDT accounts must maintain $25,000 in equity at all times. If equity falls below this, the account is restricted from day trading.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-32",
      "question": "Which of the following is NOT required when opening a new customer account?",
      "options": [
        "Customer's name and address",
        "Social Security Number or Tax ID",
        "Customer's net worth and income",
        "Customer's college degree"
      ],
      "correct": 3,
      "explanation": "Educational background is not required for account opening. Required information includes: name, address, date of birth, Tax ID/SSN, employment status, financial information (income, net worth), and investment objectives and experience.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-33",
      "question": "A \"cash account\" customer must pay for purchases:",
      "options": [
        "Within 5 business days",
        "By settlement date (T+1 for equities)",
        "Within 90 days",
        "At the end of the calendar month"
      ],
      "correct": 1,
      "explanation": "Cash account customers must pay in full by settlement date. For U.S. equities, settlement is T+1 (one business day after trade date). If payment is not received, the broker may sell the securities and restrict the account.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-34",
      "question": "Free-riding in a cash account occurs when a customer:",
      "options": [
        "Trades excessively for commissions",
        "Buys securities and sells them before paying for them using the sale proceeds",
        "Fails to pay margin calls",
        "Trades on insider information"
      ],
      "correct": 1,
      "explanation": "Free-riding (Reg T violation) occurs when a customer buys securities and then sells them before paying for the purchase, using the sale proceeds to fund the original purchase. The account must be frozen for 90 days as a penalty.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-35",
      "question": "SIPC protects investors in the event of:",
      "options": [
        "Investment losses from market decline",
        "Broker-dealer insolvency — covers missing cash and securities up to $500,000",
        "Fraud by a corporate issuer",
        "Bank failures"
      ],
      "correct": 1,
      "explanation": "SIPC covers up to $500,000 per customer (including up to $250,000 in cash) if a broker-dealer fails financially. SIPC does NOT protect against investment losses from market declines or bad advice.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-36",
      "question": "Which act requires securities sold to the public to be registered with the SEC?",
      "options": [
        "Securities Exchange Act of 1934",
        "Securities Act of 1933",
        "Investment Advisers Act of 1940",
        "Glass-Steagall Act"
      ],
      "correct": 1,
      "explanation": "The Securities Act of 1933 requires issuers to register new securities offerings with the SEC and provide investors a prospectus. The 1934 Act created the SEC and governs secondary market trading.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-37",
      "question": "Insider trading is illegal because:",
      "options": [
        "It reduces broker commissions",
        "It uses material, non-public information to gain an unfair trading advantage",
        "It involves trading in foreign markets",
        "It occurs outside normal market hours"
      ],
      "correct": 1,
      "explanation": "Insider trading violates the Securities Exchange Act §10(b), Rule 10b-5 by exploiting material non-public information. Both traders and tippers can face civil and criminal penalties.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-38",
      "question": "A prospectus must be provided to investors:",
      "options": [
        "Only if they request it",
        "Before or during the sale of new securities",
        "Only after the purchase is complete",
        "Only for IPOs, not secondary offerings"
      ],
      "correct": 1,
      "explanation": "A prospectus is a formal legal document required by the SEC that provides investors with material information about a security being offered. It must be delivered before or at the time of the sale.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-39",
      "question": "The SEC's cooling-off period after a registration statement allows the SEC to:",
      "options": [
        "Approve or reject the offering based on merit",
        "Review for completeness and accuracy — not merit",
        "Set the offering price",
        "Guarantee investor returns"
      ],
      "correct": 1,
      "explanation": "During the 20-day cooling-off period after registration, the SEC reviews the filing for completeness — not investment merit. No sales can be made. A preliminary prospectus (\"red herring\") may be distributed.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-40",
      "question": "Regulation D (Reg D) exempts certain private placements from SEC registration. Which investor type is typically required?",
      "options": [
        "Retail investors only",
        "Accredited investors ($1M net worth or $200K income)",
        "Any investor willing to sign a disclosure",
        "Only pension funds"
      ],
      "correct": 1,
      "explanation": "Reg D Rule 506(b) allows unlimited capital to be raised from accredited investors (individuals with $1M net worth excluding primary residence, or $200K annual income). This exemption avoids full SEC registration.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-41",
      "question": "Rule 144 governs the resale of:",
      "options": [
        "Newly issued IPO shares",
        "Restricted and control securities by insiders and affiliates",
        "Government bonds",
        "Mutual fund shares"
      ],
      "correct": 1,
      "explanation": "Rule 144 provides a safe harbor for reselling restricted and control securities. Conditions include: holding period (6–12 months), volume limitations, manner of sale, SEC filing for large sales, and current public information availability.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-42",
      "question": "The Securities Exchange Act of 1934 created:",
      "options": [
        "The Federal Reserve",
        "The SEC and governs secondary market activity",
        "The FDIC",
        "SIPC"
      ],
      "correct": 1,
      "explanation": "The Securities Exchange Act of 1934 created the Securities and Exchange Commission (SEC) and established ongoing reporting requirements for publicly traded companies. It governs all secondary market trading, broker-dealers, and exchanges.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-43",
      "question": "Regulation S-P requires broker-dealers to:",
      "options": [
        "Register all securities offerings with the SEC",
        "Protect customers' non-public personal information and provide privacy notices",
        "File annual reports with FINRA",
        "Maintain minimum net capital standards"
      ],
      "correct": 1,
      "explanation": "Reg S-P implements the privacy provisions of the Gramm-Leach-Bliley Act. It requires financial institutions to protect customers' non-public personal information (NPI) and provide annual privacy notices describing information sharing practices.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-44",
      "question": "What does \"Regulation T\" govern?",
      "options": [
        "Broker-dealer minimum net capital requirements",
        "The extension of credit by brokers/dealers for securities purchases — the initial margin requirement (50%)",
        "Reporting requirements for large trades",
        "Insider trading restrictions"
      ],
      "correct": 1,
      "explanation": "Regulation T, issued by the Federal Reserve under the Securities Exchange Act, governs the extension of credit by brokers/dealers to customers. It sets the initial margin requirement at 50% for most equity securities.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-45",
      "question": "The Investment Company Act of 1940 primarily regulates:",
      "options": [
        "Individual investment advisers",
        "Mutual funds, ETFs, closed-end funds, and other pooled investment vehicles",
        "All securities transactions",
        "Only hedge funds"
      ],
      "correct": 1,
      "explanation": "The Investment Company Act of 1940 regulates investment companies — primarily mutual funds (open-end), closed-end funds, ETFs, and UITs. It imposes requirements on structure, governance, disclosure, and conflicts of interest.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-46",
      "question": "When the Fed raises the federal funds rate, bond prices typically:",
      "options": [
        "Rise",
        "Fall",
        "Stay the same",
        "Only short-term bonds are affected"
      ],
      "correct": 1,
      "explanation": "Bond prices and interest rates move inversely. When the Fed raises rates, newly issued bonds offer higher yields, making existing lower-yield bonds less attractive — their prices fall to compensate. This is interest rate risk.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-47",
      "question": "Inflation risk (purchasing power risk) refers to:",
      "options": [
        "The risk that a bond issuer defaults",
        "The risk that returns fail to keep pace with inflation, eroding real purchasing power",
        "The risk that a brokerage firm fails",
        "The risk that foreign currency values change"
      ],
      "correct": 1,
      "explanation": "Inflation risk is the danger that real investment returns are lower than expected because inflation erodes purchasing power. Fixed-income investors are especially vulnerable — a 3% bond loses real value when inflation runs at 4%.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-48",
      "question": "A recession is characterized by:",
      "options": [
        "Rising GDP and falling unemployment",
        "Declining GDP, rising unemployment, and falling consumer spending",
        "Stable prices and maximum employment",
        "Only a stock market decline of 20%+"
      ],
      "correct": 1,
      "explanation": "A recession is typically defined as two consecutive quarters of declining GDP. It features rising unemployment, falling consumer confidence, and reduced business investment. A bear market (20%+ stock decline) may accompany but is not the definition of a recession.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-49",
      "question": "Which of the following is a money market instrument?",
      "options": [
        "30-year Treasury bond",
        "Commercial paper",
        "Common stock",
        "Municipal bond"
      ],
      "correct": 1,
      "explanation": "Money market instruments are short-term debt securities with maturities of one year or less. Commercial paper (short-term corporate debt), T-bills, banker's acceptances, and negotiable CDs are money market instruments.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-50",
      "question": "Monetary policy in the U.S. is conducted by:",
      "options": [
        "The U.S. Treasury",
        "The Federal Reserve",
        "Congress through fiscal legislation",
        "The SEC"
      ],
      "correct": 1,
      "explanation": "The Federal Reserve conducts monetary policy by setting the federal funds rate target, conducting open market operations, and setting reserve requirements. The Treasury manages fiscal policy (taxation and spending).",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-51",
      "question": "Fiscal policy is defined as:",
      "options": [
        "The Fed's management of interest rates and money supply",
        "Government spending and tax policy to influence the economy",
        "The regulation of bank capital requirements",
        "Currency exchange rate management"
      ],
      "correct": 1,
      "explanation": "Fiscal policy involves government decisions on spending and taxation to influence economic activity. Expansionary fiscal policy (increased spending or tax cuts) stimulates the economy; contractionary policy does the opposite. Monetary policy is the Fed's domain.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-52",
      "question": "Which economic indicator is considered a \"leading indicator\" of future economic activity?",
      "options": [
        "Unemployment rate",
        "GDP growth rate",
        "Building permits and housing starts",
        "Consumer Price Index (CPI)"
      ],
      "correct": 2,
      "explanation": "Building permits and housing starts are leading indicators — they signal future economic activity before it occurs. Unemployment and GDP are lagging indicators (they confirm trends after the fact). Leading indicators include stock prices, building permits, and manufacturers' new orders.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-53",
      "question": "The Consumer Price Index (CPI) measures:",
      "options": [
        "The growth rate of GDP",
        "Changes in the price level of a basket of consumer goods and services over time",
        "Corporate profit margins",
        "Stock market performance"
      ],
      "correct": 1,
      "explanation": "The CPI measures the average change over time in prices paid by urban consumers for a market basket of goods and services. It is the most widely used measure of inflation and affects cost-of-living adjustments, Social Security benefits, and Fed policy decisions.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-54",
      "question": "When the yield curve is inverted, it means:",
      "options": [
        "Short-term rates are higher than long-term rates — historically a recession predictor",
        "Long-term rates are higher than short-term rates",
        "All yields are equal regardless of maturity",
        "The Fed has set rates at zero"
      ],
      "correct": 0,
      "explanation": "An inverted yield curve occurs when short-term interest rates exceed long-term rates. This is unusual — investors normally demand higher rates for longer maturities. An inverted curve has historically predicted recessions and indicates market expectations of future rate cuts.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-55",
      "question": "Which of the following best describes \"stagflation\"?",
      "options": [
        "High economic growth with low inflation",
        "Simultaneous high inflation and stagnant economic growth/high unemployment",
        "Rapid economic expansion with rising wages",
        "Deflation combined with high unemployment"
      ],
      "correct": 1,
      "explanation": "Stagflation is the rare and difficult combination of stagnant economic growth (high unemployment) and high inflation. It's particularly challenging for policymakers because the typical tools for fighting inflation (raising rates) can worsen unemployment.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-56",
      "question": "A 70-year-old retiree on fixed income asks about penny stocks. Your primary concern is:",
      "options": [
        "Commission potential",
        "Suitability — speculative stocks are inappropriate for a conservative retiree",
        "Tax implications only",
        "Liquidity of the account"
      ],
      "correct": 1,
      "explanation": "Penny stocks are highly speculative and unsuitable for conservative retirees who depend on their assets for income. The key suitability factors are age, income needs, risk tolerance, and investment time horizon.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-57",
      "question": "Risk tolerance encompasses:",
      "options": [
        "Only how much money a client has",
        "Both the financial capacity to absorb losses AND the psychological comfort with volatility",
        "Only the maximum legal leverage allowed",
        "Only the volatility of a specific asset"
      ],
      "correct": 1,
      "explanation": "Risk tolerance has two dimensions: risk capacity (financial ability to absorb losses) and risk willingness (psychological comfort with fluctuations). Both must be assessed — a client may be able to afford risk but psychologically unable to handle it.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-58",
      "question": "A Traditional IRA provides:",
      "options": [
        "After-tax contributions and tax-free withdrawals",
        "Potentially tax-deductible contributions and tax-deferred growth",
        "No tax benefits — same as a brokerage account",
        "Tax-free growth and contributions"
      ],
      "correct": 1,
      "explanation": "Traditional IRA contributions may be tax-deductible (depending on income and workplace plan participation). Growth is tax-deferred, and withdrawals in retirement are taxed as ordinary income. This differs from Roth IRAs which use after-tax contributions.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-59",
      "question": "A Roth IRA's key benefit is:",
      "options": [
        "Tax deduction on contributions",
        "Tax-free growth and tax-free qualified withdrawals",
        "No contribution limits",
        "Employer matching contributions"
      ],
      "correct": 1,
      "explanation": "Roth IRAs are funded with after-tax dollars. Qualified withdrawals — including all earnings — are completely tax-free. No required minimum distributions (RMDs) exist during the owner's lifetime, making them excellent for estate planning.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-60",
      "question": "Which factor is NOT considered in determining investment suitability?",
      "options": [
        "Client's age",
        "Client's net worth and income",
        "Advisor's commission on the product",
        "Client's investment time horizon"
      ],
      "correct": 2,
      "explanation": "Suitability is based on client-specific factors: age, income, net worth, investment objectives, time horizon, tax status, and risk tolerance. An advisor's compensation from a product is not a suitability factor — letting commission influence recommendations creates a conflict of interest.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-61",
      "question": "A 529 plan is primarily used for:",
      "options": [
        "Retirement savings",
        "Tax-advantaged savings for qualified education expenses",
        "Health savings",
        "First-time homebuyer savings"
      ],
      "correct": 1,
      "explanation": "529 plans are state-sponsored education savings plans. Contributions grow tax-free and qualified withdrawals for education expenses (tuition, books, room and board) are tax-free federally. Many states offer deductions for contributions.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-62",
      "question": "Which account allows an employer to match employee contributions?",
      "options": [
        "Traditional IRA",
        "Roth IRA",
        "401(k)",
        "529 plan"
      ],
      "correct": 2,
      "explanation": "401(k) plans are employer-sponsored defined contribution plans where employers can match employee contributions — effectively free additional compensation. IRAs are individual accounts with no employer involvement. 401(k)s also have much higher contribution limits than IRAs.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-63",
      "question": "The 10% early withdrawal penalty from a Traditional IRA applies before age:",
      "options": [
        "55",
        "59½",
        "62",
        "65"
      ],
      "correct": 1,
      "explanation": "Distributions from Traditional IRAs before age 59½ are subject to a 10% early withdrawal penalty plus ordinary income tax, unless a specific exception applies (death, disability, substantially equal periodic payments, etc.).",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-64",
      "question": "An ETF (Exchange-Traded Fund) differs from a mutual fund in that:",
      "options": [
        "ETFs are not diversified",
        "ETFs trade on an exchange throughout the day like stocks, while mutual funds price once at end of day",
        "ETFs are not regulated by the SEC",
        "ETFs can only hold bonds"
      ],
      "correct": 1,
      "explanation": "ETFs trade on exchanges throughout the day at market prices, while mutual funds are priced once daily at NAV after market close. ETFs also typically have lower expense ratios and are more tax-efficient than mutual funds due to their creation/redemption mechanism.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-65",
      "question": "A variable annuity's investment subaccounts are most similar to:",
      "options": [
        "Certificates of deposit",
        "Mutual funds within an insurance wrapper",
        "Fixed-income government bonds",
        "FDIC-insured savings accounts"
      ],
      "correct": 1,
      "explanation": "Variable annuity subaccounts function like mutual funds — contract owners allocate premiums among investment portfolios. Returns are variable and reflect market performance. They are securities requiring a securities license (Series 6 or 7) to sell.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-66",
      "question": "A fixed annuity guarantees:",
      "options": [
        "A return tied to stock market performance",
        "A fixed rate of return and principal protection, backed by the insurer",
        "Tax-free withdrawals",
        "No surrender charges"
      ],
      "correct": 1,
      "explanation": "Fixed annuities guarantee a specified rate of return and protect principal, backed by the insurance company's general account. They are insurance products — not securities — and do not require a securities license to sell. Returns are modest but predictable.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-67",
      "question": "Real Estate Investment Trusts (REITs) are required to distribute what percentage of taxable income to shareholders?",
      "options": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "correct": 3,
      "explanation": "To maintain REIT status, a company must distribute at least 90% of its taxable income to shareholders as dividends. In exchange, REITs pay little or no corporate income tax. This makes them attractive for income investors but means little reinvestment of earnings.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-68",
      "question": "A Unit Investment Trust (UIT) differs from a mutual fund in that:",
      "options": [
        "UITs are actively managed",
        "UITs have a fixed portfolio that does not change and a set termination date",
        "UITs can be redeemed at any time at NAV",
        "UITs are only available to accredited investors"
      ],
      "correct": 1,
      "explanation": "UITs hold a fixed, unmanaged portfolio of securities that does not change. They have a set termination date when the trust is dissolved and proceeds distributed. Unlike mutual funds, UITs are not actively managed — they buy and hold a defined portfolio.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-69",
      "question": "Which type of risk CANNOT be eliminated through diversification?",
      "options": [
        "Company-specific risk",
        "Industry risk",
        "Systematic (market) risk",
        "Credit risk"
      ],
      "correct": 2,
      "explanation": "Systematic (market) risk affects the entire market and cannot be eliminated through diversification. Examples include interest rate changes, recessions, and geopolitical events. Unsystematic risk (company-specific, industry-specific) CAN be reduced through diversification.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-70",
      "question": "Dollar-cost averaging (DCA) is best described as:",
      "options": [
        "Buying only when markets are at lows",
        "Investing a fixed dollar amount at regular intervals regardless of price",
        "Diversifying across asset classes",
        "Rebalancing quarterly"
      ],
      "correct": 1,
      "explanation": "DCA involves investing a fixed dollar amount at regular intervals. When prices are low, more shares are purchased; when high, fewer. This reduces average cost per share over time and removes emotion from timing decisions. It does not guarantee profit or protect against losses.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-71",
      "question": "Which of the following best describes an index fund?",
      "options": [
        "A fund that tries to beat the market through active stock selection",
        "A fund designed to replicate the performance of a specific market index",
        "A fund only available to institutional investors",
        "A fund that invests exclusively in bonds"
      ],
      "correct": 1,
      "explanation": "An index fund passively tracks a market index (like the S&P 500) by holding the same securities in the same proportions. Index funds typically have lower expense ratios than actively managed funds and, over time, often outperform most active managers due to lower costs.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-72",
      "question": "A Currency Transaction Report (CTR) must be filed for cash transactions of:",
      "options": [
        "$1,000 or more",
        "$5,000 or more",
        "More than $10,000 in a single business day",
        "$25,000 or more"
      ],
      "correct": 2,
      "explanation": "A CTR must be filed with FinCEN for cash transactions exceeding $10,000 in a single business day. Structuring transactions to stay below this threshold (\"smurfing\") is itself a federal crime under the Bank Secrecy Act.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-73",
      "question": "A Suspicious Activity Report (SAR) must be filed when:",
      "options": [
        "A customer makes a profit on a trade",
        "A broker suspects a transaction involves money laundering or illegal activity",
        "A customer withdraws more than $5,000",
        "A new account is opened without ID"
      ],
      "correct": 1,
      "explanation": "SARs must be filed with FinCEN within 30 days of detecting suspicious activity. Crucially, the customer must NOT be notified a SAR was filed — \"tipping off\" a customer about a SAR is itself a federal violation.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-74",
      "question": "Know Your Customer (KYC) rules require broker-dealers to:",
      "options": [
        "Know every detail of a customer's personal life",
        "Verify customer identity and understand the nature and source of funds",
        "Approve all customer investment decisions",
        "File a report for every new account"
      ],
      "correct": 1,
      "explanation": "KYC mandates that broker-dealers verify customer identity (name, DOB, address, TIN) and understand the customer's financial profile to prevent money laundering and terrorist financing — FINRA Rule 4512 and BSA requirements.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-75",
      "question": "\"Structuring\" under the Bank Secrecy Act refers to:",
      "options": [
        "Creating a diversified portfolio",
        "Deliberately breaking up large cash transactions to avoid CTR reporting requirements",
        "Organizing a new securities offering",
        "Setting up multiple brokerage accounts legally"
      ],
      "correct": 1,
      "explanation": "Structuring (31 U.S.C. §5324) is the illegal practice of breaking cash transactions into smaller amounts specifically to evade the $10,000 CTR reporting requirement. It is a federal crime regardless of whether the underlying funds are legal.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-76",
      "question": "FINRA Rule 4512 requires firms to collect which of the following for non-institutional accounts?",
      "options": [
        "Customer's health history",
        "Customer's name, tax ID, date of birth, and address at minimum",
        "Customer's educational background",
        "Customer's political affiliation"
      ],
      "correct": 1,
      "explanation": "FINRA Rule 4512 requires firms to collect: name, address, phone, date of birth, occupation/employer, whether customer is affiliated with FINRA/exchange/public company, and financial information for making suitable recommendations.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-77",
      "question": "A call option gives the buyer the right to:",
      "options": [
        "Sell the underlying at the strike price",
        "Buy the underlying at the strike price before expiration",
        "Receive a dividend payment",
        "Sell shares short"
      ],
      "correct": 1,
      "explanation": "A call option gives the holder the right (not obligation) to BUY the underlying security at the strike price on or before expiration. The buyer pays a premium. Call options profit when the underlying rises above the strike plus premium paid.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-78",
      "question": "A put option buyer profits when:",
      "options": [
        "The underlying security rises significantly",
        "The underlying falls below the strike price minus premium paid",
        "Interest rates decline",
        "The company pays a dividend"
      ],
      "correct": 1,
      "explanation": "A put option gives the holder the right to SELL the underlying at the strike price. The put buyer profits when the stock falls below breakeven (strike minus premium). Puts are commonly used as portfolio insurance or for speculative bearish positions.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-79",
      "question": "The maximum loss for a buyer of a call option is:",
      "options": [
        "Unlimited",
        "The strike price",
        "The premium paid",
        "The difference between stock price and strike"
      ],
      "correct": 2,
      "explanation": "A call buyer's maximum loss is limited to the premium paid for the option. If the option expires worthless (stock stays below strike), the buyer loses only the premium — not the full value of the underlying security.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-80",
      "question": "What does \"in the money\" mean for a call option?",
      "options": [
        "The option has expired worthless",
        "The stock price is above the call's strike price",
        "The investor has earned profit after commissions",
        "The option has more than 6 months until expiration"
      ],
      "correct": 1,
      "explanation": "A call option is \"in the money\" (ITM) when the underlying stock price is above the strike price — the option has intrinsic value. \"At the money\" means stock equals strike. \"Out of the money\" means stock is below the strike.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-81",
      "question": "Options expire on which day of the month by standard convention?",
      "options": [
        "The first Friday",
        "The third Friday",
        "The last business day",
        "The fifteenth of the month"
      ],
      "correct": 1,
      "explanation": "Standard equity options expire on the third Friday of the expiration month. Weekly options (introduced by CBOE) expire on each Friday. The actual last trading day is typically the third Friday; exercise/assignment may occur through Saturday.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-82",
      "question": "A \"margin account\" allows a customer to:",
      "options": [
        "Invest tax-free",
        "Borrow money from the broker to purchase additional securities using existing holdings as collateral",
        "Trade international securities only",
        "Avoid paying commissions"
      ],
      "correct": 1,
      "explanation": "A margin account allows customers to borrow from the broker-dealer to purchase additional securities. The existing securities serve as collateral. Margin amplifies both gains and losses and requires a signed margin agreement.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-83",
      "question": "Under Regulation T, the initial margin requirement for equity securities is:",
      "options": [
        "25%",
        "50%",
        "75%",
        "100%"
      ],
      "correct": 1,
      "explanation": "Regulation T (Federal Reserve) requires investors to deposit at least 50% of the purchase price of marginable securities. The remaining 50% is borrowed from the broker. FINRA Rule 4210 sets the maintenance margin at 25% of market value.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-84",
      "question": "A \"margin call\" is triggered when:",
      "options": [
        "An investor makes a profit exceeding 50%",
        "Account equity falls below the maintenance margin requirement",
        "An investor deposits additional cash",
        "A stock pays a dividend"
      ],
      "correct": 1,
      "explanation": "A margin call occurs when a margin account's equity falls below the broker's maintenance margin requirement (minimum 25% per FINRA, often higher). The investor must deposit additional cash/securities or the broker will liquidate positions.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-85",
      "question": "Which of the following securities CANNOT be purchased on margin in the first 30 days after issuance?",
      "options": [
        "NYSE-listed common stock",
        "OTC stocks on Nasdaq",
        "IPO shares",
        "S&P 500 ETFs"
      ],
      "correct": 2,
      "explanation": "FINRA prohibits the purchase of IPO shares on margin during the first 30 days after issuance. This prevents speculation and price manipulation in new offerings. Most exchange-listed and Nasdaq-listed stocks are eligible for margin.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-86",
      "question": "A \"red herring\" prospectus is:",
      "options": [
        "A final prospectus with the offering price",
        "A preliminary prospectus distributed during the cooling-off period before the final price is set",
        "A prospectus for a fraudulent offering",
        "A document filed after the offering is complete"
      ],
      "correct": 1,
      "explanation": "A \"red herring\" (preliminary prospectus) is distributed during the SEC's 20-day cooling-off period. It contains material information about the company but NOT the final offering price or effective date, which appear in the final prospectus. It gets its name from a required red-ink disclaimer.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-87",
      "question": "Rule 10b-5 under the Securities Exchange Act of 1934 prohibits:",
      "options": [
        "Margin trading above 50%",
        "Fraud, misrepresentation, or omission of material facts in connection with the purchase or sale of securities",
        "Short selling without locating shares first",
        "Trading after 4 p.m. EST"
      ],
      "correct": 1,
      "explanation": "Rule 10b-5 is the SEC's primary anti-fraud rule. It prohibits any device, scheme, or artifice to defraud, any untrue statement of material fact, or any omission of material fact in connection with the purchase or sale of any security. Insider trading prosecutions rely heavily on this rule.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-88",
      "question": "Which of the following is an example of a \"tombstone\" advertisement?",
      "options": [
        "A detailed prospectus filed with the SEC",
        "A brief factual announcement of a new securities offering that identifies the issuer, security type, and underwriters",
        "A false advertising claim for securities",
        "A press release about a company's earnings"
      ],
      "correct": 1,
      "explanation": "A tombstone is a bare-bones factual advertisement (named for its austere appearance) that announces a securities offering. It contains only basic information: issuer name, type/amount of securities, price, and underwriters. It explicitly states it is not an offer to sell.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-89",
      "question": "The \"12b-1 fee\" in a mutual fund is:",
      "options": [
        "A redemption fee charged when selling shares",
        "An annual marketing and distribution fee charged against fund assets",
        "A transaction fee paid to the SEC",
        "A front-end load charged at purchase"
      ],
      "correct": 1,
      "explanation": "A 12b-1 fee is an annual fee (up to 1% of assets per SEC rules) charged by some mutual funds to cover marketing, distribution, and shareholder service costs. Funds with 12b-1 fees above 0.25% cannot call themselves \"no-load.\"",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-90",
      "question": "Which share class of a mutual fund typically has the highest front-end sales load?",
      "options": [
        "Class B shares",
        "Class C shares",
        "Class A shares",
        "Institutional shares"
      ],
      "correct": 2,
      "explanation": "Class A shares typically carry a front-end sales load (charged at purchase, up to 8.5% per FINRA rules) but lower 12b-1 fees and lower ongoing expenses. Class A is generally best for long-term, large investors. Class B has back-end loads; Class C has level loads.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-91",
      "question": "What is a \"breakpoint\" in mutual fund investing?",
      "options": [
        "When a fund's NAV reaches zero",
        "A dollar threshold at which investors qualify for reduced sales charges (loads)",
        "The point at which a fund closes to new investors",
        "A mandatory fund rebalancing trigger"
      ],
      "correct": 1,
      "explanation": "Breakpoints are discount levels on front-end sales loads. When a single purchase or cumulative purchases reach specified dollar thresholds, the load percentage decreases. FINRA requires reps to inform clients of available breakpoints — failing to do so is a violation.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-92",
      "question": "A \"rights offering\" allows existing shareholders to:",
      "options": [
        "Vote to remove the board of directors",
        "Purchase additional shares at a discount before the public offering",
        "Sell shares back to the company at par value",
        "Receive a special cash dividend"
      ],
      "correct": 1,
      "explanation": "In a rights offering, a company gives existing shareholders the right to purchase additional shares at a discount to the current market price, in proportion to their current holdings. This is a way to raise capital while giving existing shareholders the opportunity to maintain their ownership percentage.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-93",
      "question": "Which of the following best describes \"short selling\"?",
      "options": [
        "Selling a security for less than you paid for it",
        "Borrowing shares and selling them, hoping to buy them back later at a lower price for a profit",
        "Selling options contracts",
        "Selling bonds before maturity"
      ],
      "correct": 1,
      "explanation": "Short selling involves borrowing shares from a broker and selling them, hoping the price will fall. The short seller then buys shares in the market at the lower price to return to the lender, pocketing the difference. Short sellers face unlimited potential losses if the stock rises.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-94",
      "question": "The uptick rule (Rule 10a-1) historically required short sales to occur:",
      "options": [
        "Only after market hours",
        "At a price equal to or higher than the last different sale price",
        "Only in declining markets",
        "Only for NYSE-listed securities"
      ],
      "correct": 1,
      "explanation": "The original uptick rule required short sales to be executed at a price higher than the last reported sale or at the same price if the last price change was an uptick. The SEC replaced it with the Alternative Uptick Rule (Rule 201) in 2010, which restricts short selling only when a stock has declined 10% or more in one day.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-95",
      "question": "Which of the following actions constitutes market manipulation?",
      "options": [
        "Buying a stock because of positive fundamental analysis",
        "Executing wash sales to create the appearance of trading activity and inflate price",
        "Selling a stock that has declined in value",
        "Short selling a stock anticipated to fall"
      ],
      "correct": 1,
      "explanation": "Wash sales (for manipulation purposes) involve simultaneously buying and selling the same security to create artificial trading volume and mislead other investors. This is illegal under the Securities Exchange Act. Note: the IRS wash sale rule (for taxes) is a separate concept.",
      "points": 15
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-96",
      "question": "A \"stop order\" becomes a market order when:",
      "options": [
        "The investor calls the broker",
        "The stop price is reached or passed, triggering an immediate market execution",
        "The market closes",
        "The stock pays a dividend"
      ],
      "correct": 1,
      "explanation": "A stop order (stop-loss or stop-buy) becomes a market order once the specified stop price is reached or passed. It does not guarantee execution at the stop price — in fast markets, the actual fill may be significantly different. Stop-limit orders add a limit price to control the execution price.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-97",
      "question": "A \"limit order\" guarantees:",
      "options": [
        "Immediate execution at any price",
        "Execution only at the specified price or better — but does NOT guarantee execution if the price is not reached",
        "A better price than the current market",
        "Execution within 24 hours"
      ],
      "correct": 1,
      "explanation": "A limit order specifies the maximum price to pay (buy limit) or minimum price to accept (sell limit). It guarantees price (execution only at the limit price or better) but does NOT guarantee execution — if the market never reaches the limit price, the order may not fill.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-98",
      "question": "The ex-dividend date is significant because:",
      "options": [
        "It is when dividends are paid",
        "Investors who buy shares ON or AFTER the ex-dividend date do NOT receive the upcoming dividend — only investors of record before this date receive it",
        "It is when the company declares the dividend",
        "The stock price always rises on this date"
      ],
      "correct": 1,
      "explanation": "The ex-dividend date is the cutoff: investors who buy shares on or after the ex-dividend date are NOT entitled to the upcoming dividend. On the ex-dividend date, a stock's price typically falls by approximately the dividend amount. The record date is typically one business day after the ex-dividend date.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-99",
      "question": "Which of the following describes a \"blue chip\" stock?",
      "options": [
        "Any stock trading under $5",
        "Shares of small startup companies with high growth potential",
        "Shares of large, well-established, financially stable companies with a long history of reliable performance",
        "Any stock listed on the NYSE"
      ],
      "correct": 2,
      "explanation": "Blue chip stocks are shares of large, financially sound, well-established companies with long histories of reliable performance and often dividend payments — examples include Coca-Cola, Johnson & Johnson, and Microsoft. The term comes from poker where blue chips have the highest value.",
      "points": 10
    },
    {
      "exam": "SIE",
      "domain": "Legacy Foundation",
      "difficulty": "trainee",
      "cooldown": 62,
      "topicTag": "legacy-basic-100",
      "question": "Which of the following is a characteristic of a \"growth stock\"?",
      "options": [
        "High dividend yield and stable earnings",
        "A company expected to grow faster than average — typically reinvesting earnings rather than paying dividends, trading at a high P/E ratio",
        "Low volatility and steady revenue",
        "Only found in the utility sector"
      ],
      "correct": 1,
      "explanation": "Growth stocks are companies expected to grow revenues and earnings faster than the market average. They typically reinvest profits rather than paying dividends, trade at premium valuations (high P/E), and are more volatile. Technology companies are often classified as growth stocks.",
      "points": 10
    }
  ],
  "intermediate": [
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-1",
      "question": "A covered call involves:",
      "options": [
        "Buying a call option without owning the stock",
        "Selling a call option against stock already owned — generating income with capped upside",
        "Buying both a call and put at the same strike",
        "Writing a put against owned stock"
      ],
      "correct": 1,
      "explanation": "A covered call involves selling a call option against shares already owned. The seller collects the premium as income but caps their upside if the stock rises above the strike. It is \"covered\" because the owned shares offset the risk of the short call.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-2",
      "question": "A protective put strategy involves:",
      "options": [
        "Selling a put to generate income",
        "Buying a put to hedge against downside loss in an existing stock position",
        "Buying a call to speculate on upside",
        "Writing a covered call against owned shares"
      ],
      "correct": 1,
      "explanation": "A protective put involves buying a put option on shares already owned. It functions like insurance — the put sets a floor on the maximum loss. The cost is the put premium. This is one of the most common hedging strategies.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-3",
      "question": "A long straddle involves purchasing:",
      "options": [
        "Two calls at different strike prices",
        "Both a call and put with the same strike and expiration",
        "A call and a put with different expirations",
        "Only a put at a lower strike"
      ],
      "correct": 1,
      "explanation": "A long straddle involves buying both a call and a put with the same strike price and expiration date. It profits from significant price movement in either direction. The combined premium represents the breakeven — the stock must move more than the total premium paid.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-4",
      "question": "The maximum gain for a seller (writer) of a naked call is:",
      "options": [
        "Unlimited",
        "The strike price plus premium",
        "The premium received",
        "The current stock price"
      ],
      "correct": 2,
      "explanation": "A call writer receives the premium upfront. If the option expires worthless, the writer keeps the full premium — the maximum gain. However, a naked call writer has unlimited potential loss if the stock rises dramatically.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-5",
      "question": "An investor writes a put option on XYZ at a $50 strike for a $3 premium. The maximum loss is:",
      "options": [
        "$3 per share",
        "$47 per share (strike minus premium)",
        "$50 per share",
        "Unlimited"
      ],
      "correct": 1,
      "explanation": "The put writer receives the $3 premium. If the stock falls to $0, the writer must buy it at $50 (the strike). Maximum loss = $50 − $3 = $47 per share. Unlike a naked call, the maximum loss for a short put is limited (the stock cannot go below zero).",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-6",
      "question": "A bull call spread involves:",
      "options": [
        "Buying a call and selling a higher-strike call on the same underlying",
        "Buying two calls at the same strike",
        "Selling a call and buying a put",
        "Buying a call and a put at the same strike"
      ],
      "correct": 0,
      "explanation": "A bull call spread involves buying a call at a lower strike and selling a call at a higher strike (same underlying, same expiration). The short call reduces the net premium paid, limiting both maximum profit (capped at the difference between strikes minus net premium) and maximum loss (net premium paid).",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-7",
      "question": "Options contracts on equity securities standardly cover how many shares?",
      "options": [
        "10 shares",
        "50 shares",
        "100 shares",
        "1,000 shares"
      ],
      "correct": 2,
      "explanation": "Standard equity options contracts cover 100 shares of the underlying security. When an investor buys 1 call option at a $3 premium, the actual cost is $300 ($3 × 100 shares). This standardization facilitates exchange trading and liquidity.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-8",
      "question": "What is the maximum loss for a buyer of a put option?",
      "options": [
        "Unlimited",
        "The strike price minus the premium",
        "The premium paid",
        "The full value of the underlying stock"
      ],
      "correct": 2,
      "explanation": "A put buyer's maximum loss is the premium paid. If the stock rises above the strike price, the put expires worthless and the buyer loses only the premium. This is why buying options (calls or puts) has defined, limited risk for the buyer.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-9",
      "question": "A long call option's breakeven at expiration is calculated as:",
      "options": [
        "Strike price minus premium paid",
        "Strike price plus premium paid",
        "Current stock price plus premium",
        "Strike price only"
      ],
      "correct": 1,
      "explanation": "A call option buyer breaks even when the stock price equals the strike price plus the premium paid. For example, a call with a $50 strike bought for $3 breaks even at $53. The stock must rise above $53 for the buyer to profit at expiration.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-10",
      "question": "LEAPS options differ from standard options in that they:",
      "options": [
        "Cover 1,000 shares instead of 100",
        "Have expiration dates up to 3 years in the future",
        "Are only available on index securities",
        "Cannot be traded before expiration"
      ],
      "correct": 1,
      "explanation": "LEAPS (Long-term Equity AnticiPation Securities) are options with expiration dates up to 3 years in the future. They allow investors to take longer-term positions using options. They otherwise work the same as standard options — 100-share contracts, same exercise rights.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-11",
      "question": "The primary tax advantage of most municipal bonds is:",
      "options": [
        "Exempt from capital gains tax",
        "Interest is generally exempt from federal income tax, and often state/local taxes",
        "They are FDIC insured",
        "Principal is guaranteed by the U.S. government"
      ],
      "correct": 1,
      "explanation": "Municipal bond interest is generally exempt from federal income tax. Interest may also be exempt from state and local taxes for residents of the issuing state. This tax advantage makes munis especially attractive to investors in higher tax brackets.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-12",
      "question": "A general obligation (GO) bond is backed by:",
      "options": [
        "Revenue from a specific project",
        "The full faith and credit of the municipality, including its taxing power",
        "Federal government guarantees",
        "The issuer's real estate holdings"
      ],
      "correct": 1,
      "explanation": "GO bonds are backed by the municipality's unlimited taxing authority — the issuer can raise taxes to service the debt. Revenue bonds are repaid only from the specific revenue generated by the financed project (tolls, utility fees) and carry higher default risk.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-13",
      "question": "The tax-equivalent yield formula is used to:",
      "options": [
        "Determine a bond's current yield",
        "Compare a tax-exempt muni yield to a taxable bond yield for an investor in a specific bracket",
        "Calculate after-fee mutual fund returns",
        "Assess duration risk"
      ],
      "correct": 1,
      "explanation": "Tax-equivalent yield = Muni yield ÷ (1 − marginal tax rate). A 3% muni is equivalent to a 5% taxable bond for an investor in the 40% bracket. This allows apples-to-apples comparison of tax-exempt and taxable bonds.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-14",
      "question": "Revenue bonds are considered riskier than GO bonds because:",
      "options": [
        "They pay higher interest rates always",
        "Their repayment depends solely on revenues from the specific project financed, not the municipality's general taxing power",
        "They are not regulated by the SEC",
        "Revenue bonds are not backed by the issuer's full faith and credit"
      ],
      "correct": 1,
      "explanation": "Revenue bond repayment depends entirely on the cash flow generated by the specific project (toll road, hospital, airport). If the project underperforms, bondholders bear the risk. GO bonds are backed by the full faith and credit and taxing power of the issuer.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-15",
      "question": "Which type of municipal bond is typically used to fund airports, toll roads, and utilities?",
      "options": [
        "General obligation bond",
        "Revenue bond",
        "Tax anticipation note (TAN)",
        "Industrial development bond"
      ],
      "correct": 1,
      "explanation": "Revenue bonds fund projects that generate their own income stream — airports, toll roads, water systems, hospitals. The revenue from these projects services the debt. They are not backed by the municipality's general taxing authority.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-16",
      "question": "A \"double-barreled\" municipal bond is backed by:",
      "options": [
        "Two separate municipalities",
        "Both a specific revenue source AND the taxing authority of the issuing municipality",
        "Two different maturities of bonds",
        "The federal government and the state"
      ],
      "correct": 1,
      "explanation": "A double-barreled bond has two layers of security: revenue from the specific project it finances AND the general obligation backing of the issuing municipality. This dual security makes them less risky than pure revenue bonds.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-17",
      "question": "The wash sale rule disallows a loss when the same security is repurchased within:",
      "options": [
        "15 days before or after the sale",
        "30 days before or after the sale",
        "60 days after the sale",
        "90 days after the sale"
      ],
      "correct": 1,
      "explanation": "The IRS Wash Sale Rule (IRC §1091) disallows a loss if the same or substantially identical security is purchased within 30 days before OR after the sale at a loss. The disallowed loss is added to the cost basis of the new shares.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-18",
      "question": "Long-term capital gains tax rates apply to securities held for:",
      "options": [
        "At least 6 months",
        "More than one year",
        "More than 2 years",
        "At least 90 days"
      ],
      "correct": 1,
      "explanation": "To qualify for preferential LTCG rates (0%, 15%, or 20% depending on income), a security must be held for MORE than one year. Gains on securities held one year or less are short-term and taxed as ordinary income.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-19",
      "question": "A client received a $50,000 inheritance. This is generally:",
      "options": [
        "Taxable as ordinary income",
        "Not taxable to the recipient under IRC §102",
        "Taxable at a flat 15%",
        "Taxable only if over $15,000"
      ],
      "correct": 1,
      "explanation": "Under IRC §102, inherited property is excluded from the recipient's gross income. However, income earned by inherited assets AFTER receipt (dividends, interest) is taxable. Estate taxes are the estate's liability, not the heir's income tax.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-20",
      "question": "The \"step-up in cost basis\" upon death means:",
      "options": [
        "The estate must sell all assets immediately",
        "Inherited assets receive a new cost basis equal to their fair market value at the date of death, eliminating unrealized gains",
        "The beneficiary pays capital gains on all appreciation",
        "The original cost basis is carried forward to the heir"
      ],
      "correct": 1,
      "explanation": "When an asset is inherited, its cost basis is \"stepped up\" to the fair market value on the date of death (or alternate valuation date). This eliminates the capital gains tax on appreciation during the decedent's lifetime — a significant estate planning benefit.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-21",
      "question": "The alternative minimum tax (AMT) was designed to ensure:",
      "options": [
        "All investors pay a minimum 10% tax",
        "High-income taxpayers cannot eliminate tax liability entirely through deductions and preferences",
        "Capital gains are always taxed as ordinary income",
        "Municipal bond interest is always taxable"
      ],
      "correct": 1,
      "explanation": "The AMT is a parallel tax system that recalculates income by adding back certain preference items. If the AMT calculation exceeds regular tax, the difference is owed. Private activity municipal bond interest may also trigger AMT for some investors.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-22",
      "question": "Tax-loss harvesting involves:",
      "options": [
        "Buying securities with large unrealized gains",
        "Selling securities at a loss to offset capital gains, reducing overall tax liability",
        "Avoiding all capital gains by never selling",
        "Donating appreciated securities to charity"
      ],
      "correct": 1,
      "explanation": "Tax-loss harvesting involves strategically selling securities at a loss to offset realized capital gains, reducing the current-year tax bill. Up to $3,000 of net losses can be deducted against ordinary income annually, with excess losses carried forward. The wash sale rule must be observed.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-23",
      "question": "Qualified dividends are taxed at:",
      "options": [
        "Ordinary income rates",
        "Preferential long-term capital gains rates (0%, 15%, or 20%)",
        "A flat 15% rate regardless of income",
        "Social Security tax rates"
      ],
      "correct": 1,
      "explanation": "Qualified dividends (from U.S. corporations or qualified foreign corporations, held for the required period) are taxed at preferential LTCG rates — 0%, 15%, or 20% depending on income. Ordinary (non-qualified) dividends are taxed as ordinary income.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-24",
      "question": "Under Regulation T, the initial margin for equity purchases is:",
      "options": [
        "25%",
        "50%",
        "75%",
        "100%"
      ],
      "correct": 1,
      "explanation": "Regulation T (Federal Reserve) requires investors to deposit at least 50% of the purchase price of marginable securities. The remaining 50% is borrowed from the broker. FINRA sets the minimum maintenance margin at 25%.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-25",
      "question": "A margin call occurs when:",
      "options": [
        "An investor earns a profit exceeding 50%",
        "Account equity falls below the maintenance margin requirement",
        "An investor deposits additional cash",
        "A stock pays a dividend"
      ],
      "correct": 1,
      "explanation": "A margin call occurs when a margin account's equity falls below the maintenance margin (minimum 25% per FINRA, often higher per firm policy). The investor must deposit additional cash or securities, or the broker will liquidate positions.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-26",
      "question": "The \"buying power\" in a margin account is:",
      "options": [
        "The amount of cash in the account",
        "Twice the equity in the account (at 50% initial margin)",
        "The total market value of all positions",
        "Equal to the margin loan balance"
      ],
      "correct": 1,
      "explanation": "With a 50% initial margin requirement, an investor with $10,000 in equity can purchase $20,000 in securities — twice the equity amount. This is the \"buying power.\" Higher margin requirements reduce buying power proportionally.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-27",
      "question": "Securities not eligible for margin include:",
      "options": [
        "NYSE-listed common stocks",
        "Nasdaq-listed stocks",
        "Most OTC penny stocks and IPOs in first 30 days",
        "Treasury bonds"
      ],
      "correct": 2,
      "explanation": "Non-marginable securities include most OTC \"penny stocks\" (under $5), IPO shares during the first 30 days, and certain other specified securities. These cannot be used as collateral in margin accounts because they are too speculative or illiquid.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-28",
      "question": "A 12b-1 fee in a mutual fund is:",
      "options": [
        "A redemption fee when selling",
        "An annual marketing and distribution fee charged against fund assets",
        "A transaction fee paid to the SEC",
        "A load charged at purchase"
      ],
      "correct": 1,
      "explanation": "A 12b-1 fee (up to 1% of assets annually per SEC rules) covers marketing, distribution, and shareholder service costs. Funds with 12b-1 fees above 0.25% cannot call themselves \"no-load.\"",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-29",
      "question": "Class A mutual fund shares are best suited for:",
      "options": [
        "Short-term investors who plan to sell within a year",
        "Long-term investors making large purchases who qualify for breakpoint discounts",
        "Investors who prefer level loads",
        "Day traders in mutual funds"
      ],
      "correct": 1,
      "explanation": "Class A shares have a front-end load but lower ongoing expenses and 12b-1 fees. Over long time horizons with large investments (qualifying for breakpoints), the lower ongoing costs often outweigh the initial load, making A shares most cost-effective.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-30",
      "question": "A mutual fund's \"expense ratio\" represents:",
      "options": [
        "The front-end load percentage",
        "The total annual operating costs as a percentage of average net assets",
        "The redemption fee for early withdrawal",
        "The 12b-1 fee only"
      ],
      "correct": 1,
      "explanation": "The expense ratio represents all annual operating costs as a percentage of the fund's average net assets — including management fees, administrative costs, and 12b-1 fees. It directly reduces investor returns and is a key factor in fund selection.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-31",
      "question": "Which of the following is true about no-load mutual funds?",
      "options": [
        "They have no fees of any kind",
        "They charge no front-end or back-end sales loads, but may have management and 12b-1 fees",
        "They are available only through brokers",
        "They are not regulated by the SEC"
      ],
      "correct": 1,
      "explanation": "No-load funds charge no front-end or back-end sales loads. However, they still have management fees (included in the expense ratio) and may charge 12b-1 fees up to 0.25%. The absence of sales loads does not mean the fund is free.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-32",
      "question": "A Contingent Deferred Sales Charge (CDSC) in Class B shares typically:",
      "options": [
        "Is charged upfront at purchase",
        "Declines each year you hold the fund and eventually disappears",
        "Is charged annually regardless of when you sell",
        "Converts to a front-end load after 5 years"
      ],
      "correct": 1,
      "explanation": "Class B shares have a CDSC (back-end load) that declines over time — typically starting at 5-6% if sold in year 1 and decreasing to zero after 6-8 years. Class B shares often convert to Class A shares after the CDSC period expires.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-33",
      "question": "The 10% early withdrawal penalty from an IRA applies before age:",
      "options": [
        "55",
        "59½",
        "62",
        "65"
      ],
      "correct": 1,
      "explanation": "Distributions from Traditional IRAs before age 59½ are subject to a 10% early withdrawal penalty plus ordinary income tax, unless a specific exception applies such as death, disability, or substantially equal periodic payments (72(t)).",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-34",
      "question": "Under SECURE 2.0 Act, RMDs from Traditional IRAs must begin at age:",
      "options": [
        "70½",
        "72",
        "73",
        "75"
      ],
      "correct": 2,
      "explanation": "SECURE 2.0 Act (2022) raised the RMD starting age to 73 for individuals turning 72 after December 31, 2022, with a further increase to 75 planned for 2033. Failure to take the full RMD results in a 25% excise tax on the shortfall.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-35",
      "question": "A 401(k) differs from a Traditional IRA in that:",
      "options": [
        "401(k) has no contribution limits",
        "401(k) is employer-sponsored with potentially much higher contribution limits and possible employer matching",
        "401(k) withdrawals are always tax-free",
        "401(k) investments are FDIC-insured"
      ],
      "correct": 1,
      "explanation": "401(k)s are employer-sponsored defined contribution plans. Key advantages: employer matching (free money), much higher contribution limits ($23,000 vs $7,000 in 2024, plus catch-up), and automatic payroll deduction. Unlike IRAs, deductibility is never an issue.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-36",
      "question": "A 529 plan's key benefit when withdrawals are used for education is:",
      "options": [
        "Tax deductibility of contributions federally",
        "Tax-free growth and tax-free qualified withdrawals for education expenses",
        "No contribution limits of any kind",
        "FDIC insurance on the balance"
      ],
      "correct": 1,
      "explanation": "529 plan earnings grow tax-free. Qualified withdrawals (tuition, books, room and board, K-12 up to $10,000/year) are tax-free federally. Many states also offer deductions for contributions. SECURE 2.0 allows unused 529 funds to be rolled to Roth IRAs under certain conditions.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-37",
      "question": "A Health Savings Account (HSA) requires the account holder to:",
      "options": [
        "Be enrolled in any health insurance plan",
        "Be enrolled in a High Deductible Health Plan (HDHP)",
        "Be under age 65",
        "Have no other investments"
      ],
      "correct": 1,
      "explanation": "To contribute to an HSA, you must be enrolled in a High Deductible Health Plan (HDHP) and not be enrolled in Medicare or claimed as a dependent. HSAs offer a triple tax advantage: deductible contributions, tax-free growth, and tax-free qualified medical withdrawals.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-38",
      "question": "A Simplified Employee Pension (SEP-IRA) is primarily designed for:",
      "options": [
        "Large corporations with thousands of employees",
        "Self-employed individuals and small business owners — allows much higher contributions than regular IRAs",
        "Government employees only",
        "Non-profit organizations"
      ],
      "correct": 1,
      "explanation": "SEP-IRAs allow self-employed individuals and small business owners to contribute up to 25% of compensation or $69,000 (2024), whichever is less. This is far more than the $7,000 limit on Traditional IRAs, making SEPs attractive for high-income self-employed individuals.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-39",
      "question": "A bond trading at a discount means its YTM is:",
      "options": [
        "Equal to the coupon rate",
        "Lower than the coupon rate",
        "Higher than the coupon rate",
        "Zero"
      ],
      "correct": 2,
      "explanation": "When a bond trades at a discount (below par), the investor receives coupons PLUS gains the difference between purchase price and par at maturity. This makes total return (YTM) higher than the stated coupon rate. Premium bonds have YTM below coupon rate.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-40",
      "question": "Duration measures a bond's:",
      "options": [
        "Credit quality rating",
        "Price sensitivity to interest rate changes — longer duration means greater price sensitivity",
        "Time to next coupon payment",
        "Default probability"
      ],
      "correct": 1,
      "explanation": "Duration (specifically modified duration) measures how much a bond's price changes for a 1% change in interest rates. A bond with duration of 7 changes approximately 7% in price for each 1% rate change. Longer maturity and lower coupon bonds have higher duration.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-41",
      "question": "A callable bond benefits the issuer because:",
      "options": [
        "It forces investors to hold to maturity",
        "The issuer can redeem before maturity when rates fall, allowing refinancing at lower cost",
        "It increases the bond's duration",
        "It eliminates default risk"
      ],
      "correct": 1,
      "explanation": "Call provisions allow issuers to redeem bonds before maturity, typically when rates fall below the coupon rate — similar to homeowner refinancing a mortgage. Investors demand a higher yield (call premium) to compensate for this reinvestment risk.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-42",
      "question": "Credit risk (default risk) is greatest for:",
      "options": [
        "U.S. Treasury bonds",
        "AAA-rated corporate bonds",
        "High-yield (junk) bonds rated BB or below",
        "General obligation municipal bonds"
      ],
      "correct": 2,
      "explanation": "High-yield bonds (BB and below by S&P, Ba and below by Moody's) have the highest credit risk. They offer higher yields to compensate investors for this risk. U.S. Treasuries have essentially zero default risk as they are backed by the government's taxing authority.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-43",
      "question": "What is the difference between \"current yield\" and \"yield to maturity\" (YTM)?",
      "options": [
        "They are always the same",
        "Current yield = annual coupon / price; YTM includes coupon income, reinvestment of coupons, and capital gain/loss to maturity",
        "YTM is always higher than current yield",
        "Current yield only applies to zero-coupon bonds"
      ],
      "correct": 1,
      "explanation": "Current yield = annual coupon ÷ current price (simple, ignores time value). YTM is the comprehensive return measure — it accounts for coupon payments, reinvestment of those coupons at the YTM rate, and the difference between purchase price and par value at maturity. YTM is the standard bond return measure.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-44",
      "question": "A sinking fund provision in a bond indenture requires the issuer to:",
      "options": [
        "Maintain a minimum cash balance",
        "Set aside money periodically to retire portions of the bond issue before maturity",
        "Pay a higher coupon if the company's profits decline",
        "Allow investors to sell bonds back at par annually"
      ],
      "correct": 1,
      "explanation": "A sinking fund requires an issuer to systematically retire portions of a bond issue before maturity by making regular payments into a fund used to purchase or call bonds. This reduces default risk but also means some bondholders may have their bonds called at potentially unfavorable times.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-45",
      "question": "The primary purpose of portfolio rebalancing is:",
      "options": [
        "Chasing performance by adding to winners",
        "Restoring the portfolio to its target asset allocation after market drift",
        "Reducing the number of holdings to simplify management",
        "Timing the market to buy at lows"
      ],
      "correct": 1,
      "explanation": "Over time, market movements cause asset weights to drift from targets. Rebalancing restores the intended risk profile by trimming overweighted assets and adding to underweighted ones. This enforces a disciplined \"buy low, sell high\" approach systematically.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-46",
      "question": "Correlation in portfolio management refers to:",
      "options": [
        "The return of a portfolio relative to the market",
        "The statistical relationship between the returns of two assets — from -1 (perfectly inverse) to +1 (perfectly together)",
        "The total risk of a portfolio",
        "The expense ratio of a fund"
      ],
      "correct": 1,
      "explanation": "Correlation measures how two assets' returns move relative to each other. Combining assets with low or negative correlation reduces portfolio risk through diversification. Two perfectly positively correlated assets (+1) provide no diversification benefit.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-47",
      "question": "An asset allocation of 60% stocks / 40% bonds is generally considered:",
      "options": [
        "Extremely aggressive",
        "A balanced, moderate-risk allocation appropriate for many investors",
        "Ultra-conservative",
        "Only suitable for retirees"
      ],
      "correct": 1,
      "explanation": "A 60/40 portfolio is a classic moderate-risk allocation balancing growth potential (equities) with stability and income (bonds). It has historically provided reasonable returns with moderate volatility. The appropriate allocation depends on individual circumstances, time horizon, and risk tolerance.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-48",
      "question": "Standard deviation in investing measures:",
      "options": [
        "A portfolio's return relative to the market",
        "The total variability (volatility) of returns around the average",
        "Only the downside risk",
        "The correlation between assets"
      ],
      "correct": 1,
      "explanation": "Standard deviation measures the total dispersion of returns around the mean — capturing all variability, both positive and negative. Higher standard deviation means greater volatility. It is the most commonly used measure of total portfolio risk in Modern Portfolio Theory.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-49",
      "question": "The Securities Act of 1933 is also known as the:",
      "options": [
        "Exchange Act",
        "Truth in Securities Act or the Prospectus Act",
        "Investment Company Act",
        "Sarbanes-Oxley Act"
      ],
      "correct": 1,
      "explanation": "The Securities Act of 1933 is often called the \"Truth in Securities\" Act or the \"Prospectus Act.\" Its primary purposes are to ensure investors receive material information about securities offered for public sale and to prohibit misrepresentation and fraud in securities sales.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-50",
      "question": "The Financial Industry Regulatory Authority (FINRA) was created by merging:",
      "options": [
        "The SEC and the Fed",
        "The NYSE's regulatory functions and the NASD in 2007",
        "SIPC and the FDIC",
        "The OCC and the CFTC"
      ],
      "correct": 1,
      "explanation": "FINRA was created in 2007 through the consolidation of NASD (National Association of Securities Dealers) and the regulatory functions of NYSE. It is the largest independent regulator of securities firms operating in the United States.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-51",
      "question": "Under FINRA rules, correspondence to 25 or fewer retail customers is classified as:",
      "options": [
        "Retail communication requiring principal approval before use",
        "Correspondence — subject to supervision but not pre-approval",
        "Institutional communication exempt from review",
        "A research report"
      ],
      "correct": 1,
      "explanation": "FINRA Rule 2210 classifies member communications into three categories: retail communication (to more than 25 retail customers, requires principal approval before use), correspondence (25 or fewer retail customers, subject to supervision but not pre-approval), and institutional communication.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-52",
      "question": "A registered representative who moves from one broker-dealer to another must re-register within:",
      "options": [
        "30 days",
        "2 years (the standard registration grace period)",
        "90 days",
        "No re-registration is needed"
      ],
      "correct": 1,
      "explanation": "FINRA allows a registered representative a 2-year period to re-register at a new firm after leaving the securities industry without having to re-take qualifying exams, provided certain conditions are met. After 2 years, exams must be retaken.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-53",
      "question": "Which of the following transactions requires a registered principal's prior approval under FINRA rules?",
      "options": [
        "A customer's request to change their address",
        "Any options transaction — approval is required before execution",
        "A customer adding a joint account holder",
        "Sending a research report to a customer who requested it"
      ],
      "correct": 1,
      "explanation": "Options transactions require prior approval by a registered options principal (ROP). Additionally, new options accounts must be approved by a registered principal before any options trading can begin. Options-specific approvals reflect the higher complexity and risk of options trading.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-54",
      "question": "The Consolidated Audit Trail (CAT) was implemented to:",
      "options": [
        "Prevent insider trading by company executives",
        "Track all orders and trades in U.S. equity and options markets for regulatory oversight",
        "Require daily reporting of all mutual fund transactions",
        "Regulate high-frequency trading algorithms"
      ],
      "correct": 1,
      "explanation": "The CAT (implemented by the SEC under Rule 613) creates a comprehensive database tracking all orders and trades across U.S. equity and listed options markets. It allows regulators to reconstruct market events and investigate potential violations more effectively than predecessor systems like OATS.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-55",
      "question": "A \"soft dollar\" arrangement occurs when:",
      "options": [
        "A client pays for research with discounted commission rates",
        "A broker provides research services to a money manager in exchange for routing trades to that broker rather than paying cash for the research",
        "An adviser charges clients in mutual fund shares rather than cash",
        "A broker rebates a portion of commissions to clients"
      ],
      "correct": 1,
      "explanation": "Soft dollar arrangements involve a money manager directing client trades to a broker in exchange for research services (rather than paying for research directly). Section 28(e) of the Securities Exchange Act provides a safe harbor for qualifying soft dollar arrangements if the research benefits the client.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-56",
      "question": "Churning in a customer account refers to:",
      "options": [
        "Recommending too many mutual funds",
        "Excessive trading primarily to generate commissions rather than to serve the client's investment objectives",
        "Trading in international markets",
        "Buying and selling the same security on the same day"
      ],
      "correct": 1,
      "explanation": "Churning (FINRA Rule 2111, Securities Exchange Act §15(c)) is excessive trading in a customer account primarily to generate commissions rather than to serve the customer's investment objectives. It violates the suitability rule and constitutes fraud. Assessment factors include turnover ratio and cost-equity ratio.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-57",
      "question": "A \"bear spread\" using put options involves:",
      "options": [
        "Buying a lower-strike put and selling a higher-strike put",
        "Buying a higher-strike put and selling a lower-strike put — profits when the stock falls",
        "Selling two puts at the same strike",
        "Buying only calls in a falling market"
      ],
      "correct": 1,
      "explanation": "A bear put spread involves buying a higher-strike put and selling a lower-strike put (same underlying and expiration). Maximum profit = difference between strikes minus net premium paid (achieved when stock falls below lower strike). Maximum loss = net premium paid. This is a bearish strategy with defined risk and reward.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-58",
      "question": "The \"time value\" of an option is greatest when:",
      "options": [
        "The option is deep in the money",
        "The option is at or near the money with significant time remaining to expiration",
        "The option has one day until expiration",
        "The option is deep out of the money"
      ],
      "correct": 1,
      "explanation": "Time value is highest when the option is at-the-money and there is significant time remaining until expiration. Deep in-the-money options have mostly intrinsic value with little time value. Deep out-of-the-money options have minimal time value because they are unlikely to finish in the money. Time value erodes (theta decay) as expiration approaches.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-59",
      "question": "Implied volatility (IV) in options pricing represents:",
      "options": [
        "Historical volatility of the underlying over the past year",
        "The market's expectation of future volatility of the underlying, derived from current option prices",
        "The standard deviation of the underlying's daily returns",
        "The volatility of the options price itself"
      ],
      "correct": 1,
      "explanation": "Implied volatility is the market's forward-looking estimate of how volatile the underlying will be until expiration, derived by working backwards from observed option prices using a pricing model like Black-Scholes. High IV means options are expensive (high premium). IV typically rises during market uncertainty and falls when markets are calm.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-60",
      "question": "Tax-exempt commercial paper is most commonly issued by:",
      "options": [
        "Corporations with AAA credit ratings",
        "Municipal issuers to fund short-term cash needs — interest is exempt from federal income tax",
        "The U.S. Treasury for money market accounts",
        "Foreign governments accessing U.S. dollar markets"
      ],
      "correct": 1,
      "explanation": "Tax-exempt commercial paper is short-term debt issued by municipalities and other tax-exempt entities to fund temporary cash needs. Like taxable commercial paper, maturities are typically 1–270 days. The tax-exempt status benefits investors in high tax brackets — similar to tax-exempt bonds but with short-term maturities.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-61",
      "question": "Which municipal bond feature is most important when evaluating a revenue bond?",
      "options": [
        "The state's overall financial health",
        "Debt service coverage ratio — revenues generated relative to debt payments required",
        "The municipality's credit rating for general obligation debt",
        "The bond's duration relative to other munis"
      ],
      "correct": 1,
      "explanation": "The debt service coverage ratio (DSCR) is critical for revenue bonds — it measures how many times the project's revenues cover its required debt payments. A DSCR of 1.25× means revenues are 25% more than needed to cover debt service. Lower coverage ratios indicate higher default risk.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-62",
      "question": "An \"exchange fund\" helps investors with concentrated stock positions by:",
      "options": [
        "Allowing them to sell shares to the government at fair value",
        "Pooling multiple investors' concentrated positions — the investor contributes shares and receives diversified fund interests without triggering immediate capital gains",
        "Forcing the company to repurchase shares at a premium",
        "Converting stock to bonds without tax consequence"
      ],
      "correct": 1,
      "explanation": "Exchange funds (§721 partnerships) allow investors with concentrated, low-basis stock positions to contribute shares in exchange for an interest in a diversified partnership — deferring the capital gains tax. The contributed shares are pooled with other investors' concentrated positions. Requirements include: a 7-year hold period and the fund must hold 20% in illiquid assets.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-63",
      "question": "Section 1035 exchange allows tax-free exchanges between:",
      "options": [
        "Any two investment accounts",
        "Insurance products of the same type (life-to-life, annuity-to-annuity) or upgrades (life-to-annuity) without triggering tax on accumulated gains",
        "Any two mutual funds",
        "IRAs at different custodians"
      ],
      "correct": 1,
      "explanation": "A 1035 exchange permits the tax-free transfer of cash value from one life insurance policy to another, or from one annuity contract to another (or from a life policy to an annuity). The gain inside the old contract carries over as a deferral. This prevents tax on built-up gains when switching products.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-64",
      "question": "A \"Treasury receipt\" or \"STRIP\" is created when:",
      "options": [
        "The Treasury issues new short-term debt",
        "A broker-dealer separates a Treasury bond into its individual coupon payments and principal, each traded separately as zero-coupon securities",
        "The Fed repurchases outstanding Treasury bonds",
        "The Treasury recalls outstanding bonds due to an interest rate decline"
      ],
      "correct": 1,
      "explanation": "STRIPS (Separate Trading of Registered Interest and Principal of Securities) are created when financial institutions separate (\"strip\") a Treasury bond into its individual coupon payments and principal repayment, each traded as a separate zero-coupon security. They are direct obligations of the U.S. government and popular for liability matching.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-65",
      "question": "A \"Regulation A+\" offering allows smaller companies to raise up to:",
      "options": [
        "$1 million annually without registration",
        "Up to $75 million annually from both accredited and non-accredited investors under a simplified registration process (Tier 2)",
        "Unlimited amounts from institutional investors only",
        "$10 million without any SEC review"
      ],
      "correct": 1,
      "explanation": "Regulation A+ (implemented under the JOBS Act) allows smaller companies to raise up to $75M annually (Tier 2) or $20M (Tier 1) from public investors — including non-accredited investors — through a streamlined qualification process with the SEC. Tier 2 preempts state securities law registration requirements.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-66",
      "question": "The concept of \"time value of money\" states that:",
      "options": [
        "Inflation reduces the value of money over time",
        "A dollar available today is worth more than a dollar in the future because today's dollar can be invested to earn a return",
        "Government bonds are the safest investment over time",
        "Interest rates always rise over long time periods"
      ],
      "correct": 1,
      "explanation": "Time value of money is the foundational concept of finance: a dollar today is worth more than a dollar in the future because of its earning potential. This concept underlies present value and future value calculations, bond pricing, and all investment analysis. It is the basis for discounting future cash flows.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-67",
      "question": "Net Present Value (NPV) in capital budgeting is:",
      "options": [
        "The total undiscounted cash flows of a project",
        "The present value of all future cash flows from a project minus the initial investment — a positive NPV means the project adds value",
        "The nominal return on an investment over its life",
        "The ratio of benefits to costs without considering time value"
      ],
      "correct": 1,
      "explanation": "NPV = Present value of future cash flows − Initial investment. If NPV > 0, the project generates more value than its cost of capital and should be accepted. If NPV < 0, the project destroys value. NPV is generally considered superior to IRR as a capital allocation tool because it accounts for both time value and scale of investment.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-68",
      "question": "A bond's \"dirty price\" refers to:",
      "options": [
        "The price of a bond with a high probability of default",
        "The clean price plus accrued interest since the last coupon payment — the actual amount paid by the buyer",
        "The price quoted on Bloomberg terminals",
        "The price after all fees are deducted"
      ],
      "correct": 1,
      "explanation": "Bonds are typically quoted as \"clean prices\" (excluding accrued interest). However, the buyer actually pays the \"dirty price\" — clean price plus accrued interest since the last coupon payment. This accrued interest compensates the seller for holding the bond and earning interest during the period they owned it before selling.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-69",
      "question": "The \"Rule of 72\" is a shortcut to estimate:",
      "options": [
        "The maximum drawdown of a portfolio",
        "The number of years required to double an investment at a given rate (72 ÷ annual return rate)",
        "The number of securities needed for a diversified portfolio",
        "The optimal asset allocation for a given age"
      ],
      "correct": 1,
      "explanation": "The Rule of 72 divides 72 by the annual interest rate to estimate the years needed to double an investment. Example: at 6% annual return, an investment doubles in approximately 72 ÷ 6 = 12 years. It provides a quick mental math shortcut for compound growth calculations.",
      "points": 15
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-70",
      "question": "An \"accredited investor\" as defined by the SEC includes:",
      "options": [
        "Any adult willing to sign an acknowledgment of risk",
        "Individuals with $1M+ net worth (excluding primary residence) OR $200K+ annual income ($300K joint) for the past 2 years with expectation of continuation",
        "Only institutional investors with $100M+ in assets",
        "Anyone who has passed the SIE exam"
      ],
      "correct": 1,
      "explanation": "SEC Regulation D defines accredited investors as: individuals with $1M+ net worth excluding primary residence, OR $200K+ annual income ($300K joint) for the past 2 years with reasonable expectation of continuation; or entities with $5M+ in assets; or certain knowledgeable professionals. The JOBS Act expanded this to include certain licensed professionals (Series 7, 65, 82 holders).",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-71",
      "question": "The \"Volcker Rule\" (Dodd-Frank) restricts:",
      "options": [
        "Hedge funds from trading derivatives",
        "Banks from engaging in proprietary trading for their own profit and from owning certain hedge fund and private equity interests",
        "Investment advisers from managing multiple accounts",
        "Money market funds from breaking the buck"
      ],
      "correct": 1,
      "explanation": "The Volcker Rule (§619 of Dodd-Frank) prohibits banks and their affiliates from: (1) engaging in short-term proprietary trading of securities, derivatives, and certain other instruments; and (2) acquiring or retaining ownership interests in hedge funds or private equity funds. The rule aims to prevent banks from taking speculative risks with insured deposits.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-72",
      "question": "In which situation would \"dollar-cost averaging\" be LEAST beneficial?",
      "options": [
        "When markets are highly volatile",
        "When making regular contributions to a 401(k)",
        "When investing a lump sum all at once in a consistently rising market",
        "When accumulating shares over a long time horizon"
      ],
      "correct": 2,
      "explanation": "DCA is least optimal when investing a lump sum in a consistently rising market — research shows lump sum investing outperforms DCA roughly 2/3 of the time because the market tends to rise over time. DCA adds the most value in volatile markets where it allows purchasing more shares at lower prices. For regular 401(k) contributions, DCA is automatic and disciplined.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-73",
      "question": "A \"rights offering\" dilutes existing shareholders' ownership if they:",
      "options": [
        "Exercise their rights and buy the new shares",
        "Do NOT exercise their rights — since new shares are issued at a discount, non-participating shareholders experience ownership dilution and likely economic dilution",
        "Sell their rights in the market",
        "Vote against the offering at the shareholder meeting"
      ],
      "correct": 1,
      "explanation": "Rights offerings allow existing shareholders to maintain their proportional ownership by purchasing new shares at a discount. Shareholders who do NOT exercise or sell their rights experience dilution — their percentage ownership decreases as new shares are issued. The rights themselves have market value and can be sold if the shareholder doesn't want to participate.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-74",
      "question": "Which of the following is a characteristic of exchange-traded notes (ETNs)?",
      "options": [
        "ETNs are equity securities like stocks",
        "ETNs are unsecured debt obligations of the issuing bank — investors bear credit risk of the issuer in addition to market risk",
        "ETNs are FDIC-insured",
        "ETNs hold the underlying assets like an ETF"
      ],
      "correct": 1,
      "explanation": "ETNs are senior unsecured notes issued by banks that promise to pay a return linked to an index. Unlike ETFs, ETNs do NOT hold underlying assets — they are IOUs from the issuer. If the issuing bank defaults, ETN investors may lose their investment regardless of index performance. ETNs can also be called or accelerated by the issuer under certain conditions.",
      "points": 20
    },
    {
      "exam": "Series 7",
      "domain": "Legacy Foundation",
      "difficulty": "associate",
      "cooldown": 45,
      "topicTag": "legacy-intermediate-75",
      "question": "The primary benefit of a \"separate account\" in an annuity contract is:",
      "options": [
        "It is FDIC insured",
        "Assets are segregated from the insurer's general account — providing investment flexibility without exposing policy values to the insurer's general creditors in case of insolvency",
        "It eliminates all investment risk",
        "It provides guaranteed returns regardless of market performance"
      ],
      "correct": 1,
      "explanation": "Variable annuity and variable life insurance separate accounts hold policyholder investment premiums segregated from the insurer's general account assets. This means: (1) policyholders are exposed to investment risk (values fluctuate); and (2) separate account assets are NOT available to satisfy the insurer's general creditors in insolvency, protecting policyholders.",
      "points": 20
    }
  ],
  "advanced": [
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-1",
      "question": "A long straddle profits when:",
      "options": [
        "The stock stays completely flat",
        "The stock moves significantly in either direction beyond the combined premium paid",
        "Dividends increase",
        "Interest rates fall"
      ],
      "correct": 1,
      "explanation": "A long straddle (long call + long put, same strike and expiration) profits from significant price movement in either direction. The combined premium paid represents the maximum loss and the breakeven move required. Used when large volatility is expected but direction is uncertain.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-2",
      "question": "A short straddle profits when:",
      "options": [
        "The stock moves dramatically in one direction",
        "The stock remains relatively close to the strike price at expiration — both options expire worthless",
        "Interest rates rise",
        "The company announces a stock split"
      ],
      "correct": 1,
      "explanation": "A short straddle (selling both a call and put at the same strike) profits when the stock stays near the strike and both options expire worthless. The maximum gain is the total premium received; however, the risk is theoretically unlimited on the upside and substantial on the downside.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-3",
      "question": "A collar strategy involves:",
      "options": [
        "Only buying protective puts",
        "Buying a protective put and selling a covered call simultaneously, limiting both downside and upside",
        "Writing naked calls and puts at the same strike",
        "Using only futures contracts for hedging"
      ],
      "correct": 1,
      "explanation": "A collar holds long stock, buys a put (downside protection), and sells a call (to fund the put). This limits both downside risk and upside potential. It's commonly used by executives with concentrated positions who cannot sell shares — a \"zero-cost collar\" funds the put entirely with the call premium.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-4",
      "question": "The \"delta\" of an option measures:",
      "options": [
        "The time decay of an option's value",
        "The rate of change of an option's price relative to a $1 change in the underlying asset's price",
        "The implied volatility of the option",
        "The interest rate sensitivity of the option"
      ],
      "correct": 1,
      "explanation": "Delta measures how much an option's price changes for a $1 change in the underlying. Calls have positive delta (0 to 1); puts have negative delta (-1 to 0). An at-the-money option has a delta of approximately 0.50. Delta is also used as a rough probability that the option will expire in the money.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-5",
      "question": "Theta in options pricing represents:",
      "options": [
        "Volatility sensitivity",
        "Time decay — the rate at which an option loses value as expiration approaches",
        "Sensitivity to interest rate changes",
        "The relationship between option price and underlying price"
      ],
      "correct": 1,
      "explanation": "Theta measures the daily time decay of an option's value. Options lose value as expiration approaches (all else equal) because there is less time for the underlying to make a favorable move. Theta accelerates as expiration nears. Option buyers are hurt by theta; sellers benefit from it.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-6",
      "question": "An iron condor strategy involves:",
      "options": [
        "Buying one call and one put at the same strike",
        "Selling an out-of-the-money call spread and an out-of-the-money put spread simultaneously, profiting when the stock stays range-bound",
        "Buying both a call and put at different strikes",
        "Only selling calls in a rising market"
      ],
      "correct": 1,
      "explanation": "An iron condor sells an OTM call spread (sells one call, buys a higher-strike call) and simultaneously sells an OTM put spread (sells one put, buys a lower-strike put). Maximum profit is the net premium received if the stock stays between the short strikes at expiration. Maximum loss is the width of either spread minus the premium received.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-7",
      "question": "Convexity in bond analysis refers to:",
      "options": [
        "The linear relationship between bond price and yield",
        "The curvature of the price-yield relationship — convex bonds outperform duration predictions in both rising and falling rate environments",
        "A measure of credit quality",
        "The frequency of coupon payments"
      ],
      "correct": 1,
      "explanation": "Convexity measures the curvature of the price-yield relationship. Duration assumes a linear price-yield relationship, but the actual relationship is curved (convex). Bonds with higher convexity benefit more from falling rates and lose less in rising rate environments than duration alone would suggest. All else equal, higher convexity is desirable.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-8",
      "question": "Which type of bond has the LEAST interest rate risk?",
      "options": [
        "30-year zero-coupon Treasury bond",
        "20-year Treasury bond",
        "3-month Treasury bill",
        "10-year corporate bond"
      ],
      "correct": 2,
      "explanation": "A 3-month T-bill has the shortest duration and therefore the least interest rate sensitivity. Zero-coupon bonds have the highest duration (and thus most interest rate risk) for their maturity because all cash flow occurs at maturity. Longer maturities and lower coupons always mean higher duration and greater interest rate risk.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-9",
      "question": "Junk bonds (high-yield bonds) are defined as bonds rated:",
      "options": [
        "AAA to AA",
        "A to BBB (investment grade)",
        "BB and below by S&P (Ba and below by Moody's)",
        "Any bond with a yield above 10%"
      ],
      "correct": 2,
      "explanation": "Bonds rated BB or lower by S&P (Ba or lower by Moody's) are below investment grade — commonly called \"junk bonds\" or \"high-yield bonds.\" Investment grade is BBB-/Baa3 and above. Many institutional investors (pension funds, insurance companies) are restricted from holding below-investment-grade bonds.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-10",
      "question": "A bond's \"yield spread\" refers to:",
      "options": [
        "The difference between the bond's coupon and its current yield",
        "The difference between the bond's yield and a benchmark yield (typically Treasuries of the same maturity)",
        "The range of the bond's yield over its lifetime",
        "The spread between bid and ask prices"
      ],
      "correct": 1,
      "explanation": "Yield spread measures a bond's yield above a risk-free benchmark (typically same-maturity Treasuries). Wider spreads indicate higher perceived credit risk or liquidity risk. Credit spreads widen during economic stress as investors demand more compensation for default risk.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-11",
      "question": "Which of the following is a characteristic of Treasury Inflation-Protected Securities (TIPS)?",
      "options": [
        "They pay a variable coupon that rises with inflation",
        "Their principal adjusts with the CPI — providing inflation protection while paying a fixed coupon on the adjusted principal",
        "They are only available to institutional investors",
        "They have no interest rate risk"
      ],
      "correct": 1,
      "explanation": "TIPS adjust their principal value semiannually based on changes in the CPI. The fixed coupon rate is applied to the inflation-adjusted principal, providing inflation protection. At maturity, investors receive the greater of the adjusted or original principal. They still have interest rate risk based on their duration.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-12",
      "question": "Modern Portfolio Theory (MPT) demonstrates that:",
      "options": [
        "Investors should only hold the single highest-returning asset",
        "Portfolios can achieve maximum return for a given risk level through diversification of non-perfectly-correlated assets",
        "All portfolios should hold equal amounts of each asset class",
        "Past returns are the best predictor of future returns"
      ],
      "correct": 1,
      "explanation": "MPT (Harry Markowitz, 1952) shows that combining assets with less-than-perfect correlation reduces portfolio risk without sacrificing expected return. The efficient frontier represents portfolios with the maximum expected return for each risk level. The key insight: diversification genuinely reduces risk.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-13",
      "question": "The Capital Market Line (CML) represents:",
      "options": [
        "The relationship between systematic risk (beta) and expected return for individual securities",
        "The efficient frontier of all possible portfolios combining the risk-free asset and the market portfolio",
        "The yield curve for government bonds",
        "The historical performance of the S&P 500"
      ],
      "correct": 1,
      "explanation": "The CML is a line from the risk-free rate through the market portfolio (the \"tangency portfolio\" on the efficient frontier). All points on the CML represent combinations of the risk-free asset and the market portfolio — this is the most efficient risk-return combination available to all investors under CAPM assumptions.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-14",
      "question": "Alpha in portfolio management measures:",
      "options": [
        "The total return of a portfolio",
        "Risk-adjusted excess return above what would be predicted by the portfolio's beta (systematic risk)",
        "The management expense ratio",
        "The correlation between two asset classes"
      ],
      "correct": 1,
      "explanation": "Alpha represents manager skill — returns earned above what the market would predict based on the portfolio's beta. Positive alpha means the manager added value beyond market exposure. Negative alpha means underperformance after adjusting for risk. Finding genuine alpha (after fees and risk) is rare.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-15",
      "question": "The Sharpe ratio measures:",
      "options": [
        "A portfolio's absolute return",
        "Return per unit of total risk (standard deviation) — higher is better",
        "A portfolio's beta versus the market",
        "The maximum drawdown of a portfolio"
      ],
      "correct": 1,
      "explanation": "Sharpe ratio = (Portfolio Return − Risk-Free Rate) / Standard Deviation. It measures excess return per unit of total risk. A higher Sharpe ratio indicates better risk-adjusted performance. It is useful for comparing portfolios with different risk levels on a risk-adjusted basis.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-16",
      "question": "Systematic risk (market risk) is best measured by:",
      "options": [
        "Standard deviation",
        "Beta — the sensitivity of an asset's returns to overall market returns",
        "The Sharpe ratio",
        "Correlation with the risk-free rate"
      ],
      "correct": 1,
      "explanation": "Beta measures systematic (market) risk — the portion of total risk that cannot be eliminated through diversification. Beta = 1 means the asset moves with the market. Beta > 1 means more volatile than market; Beta < 1 means less volatile. Only systematic risk is compensated by expected return in CAPM.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-17",
      "question": "The CAPM formula for expected return is:",
      "options": [
        "E(R) = Rf + β(Rm − Rf)",
        "E(R) = Dividend / Price + Growth Rate",
        "E(R) = Total Return / Standard Deviation",
        "E(R) = Beta × Market Return"
      ],
      "correct": 0,
      "explanation": "CAPM: E(R) = Rf + β(Rm − Rf), where Rf is the risk-free rate, β is beta, and (Rm − Rf) is the market risk premium. This model prices only systematic risk. It implies that investors are only compensated for non-diversifiable risk — unsystematic risk can be diversified away at no cost.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-18",
      "question": "The Efficient Market Hypothesis (EMH) in its strong form states that:",
      "options": [
        "Technical analysis can consistently beat the market",
        "No investor can consistently beat the market because prices reflect ALL information including private/insider information",
        "Only fundamental analysis can beat the market",
        "Markets are efficient for small-cap stocks but not large-cap"
      ],
      "correct": 1,
      "explanation": "Strong form EMH states prices reflect all information — public AND private. This would imply even insider trading cannot generate excess returns. Most evidence supports semi-strong form EMH (prices reflect all public information) — the strong form is generally considered too extreme and contradicted by insider trading evidence.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-19",
      "question": "Under Reg BI, broker-dealers must satisfy four specific obligations. Which is NOT one of them?",
      "options": [
        "Disclosure obligation",
        "Care obligation",
        "Conflict of interest obligation",
        "Profitability obligation"
      ],
      "correct": 3,
      "explanation": "The four component obligations of Reg BI are: (1) Disclosure — inform customers of material facts about the relationship and recommendations; (2) Care — exercise reasonable diligence in recommendations; (3) Conflict of Interest — identify and mitigate conflicts; (4) Compliance — establish policies to achieve Reg BI compliance. Profitability is not an obligation.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-20",
      "question": "The primary difference between Reg BI (broker-dealers) and the Investment Advisers Act fiduciary standard (RIAs) is:",
      "options": [
        "There is no difference — both standards are identical",
        "Reg BI applies at the time of recommendation; RIAs have a continuous, ongoing fiduciary duty to clients",
        "RIAs have a lower standard than broker-dealers",
        "Reg BI only applies to institutional clients"
      ],
      "correct": 1,
      "explanation": "Reg BI imposes a best-interest standard at the time of a recommendation. RIAs under the Investment Advisers Act have an ongoing fiduciary duty — they must continuously act in clients' best interests, monitor the portfolio, and proactively disclose conflicts. The RIA standard is generally considered broader and more demanding.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-21",
      "question": "ERISA's \"exclusive benefit rule\" requires plan fiduciaries to:",
      "options": [
        "Act exclusively for the benefit of the plan sponsor",
        "Act exclusively for the benefit of plan participants and beneficiaries — not the employer or adviser",
        "Invest only in government securities",
        "Maximize plan returns regardless of risk"
      ],
      "correct": 1,
      "explanation": "ERISA §404(a) requires plan fiduciaries to act solely in the interest of plan participants and beneficiaries, and for the exclusive purpose of providing benefits and defraying reasonable expenses. Acting for the benefit of the employer, adviser, or any other party violates this rule.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-22",
      "question": "What is a \"wrap fee\" program?",
      "options": [
        "A fee that wraps around another fee",
        "An all-inclusive fee covering investment advice, transaction costs, and custody — typically a percentage of AUM",
        "A front-end load for mutual funds",
        "A surrender charge on annuities"
      ],
      "correct": 1,
      "explanation": "Wrap fee programs charge a single all-inclusive fee (typically 1-3% of AUM annually) covering investment advisory services, brokerage commissions, custody, and sometimes other services. They must be disclosed and are suitable when a client trades frequently enough that the bundled cost is competitive with à la carte pricing.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-23",
      "question": "The Investment Advisers Act of 1940 defines an \"investment adviser\" as anyone who:",
      "options": [
        "Works for a bank",
        "For compensation, is in the business of providing advice about securities",
        "Recommends mutual funds only",
        "Has passed the Series 65 exam"
      ],
      "correct": 1,
      "explanation": "Under the Advisers Act, an \"investment adviser\" is defined as a person who, for compensation, is engaged in the business of advising others about securities. Meeting all three prongs (compensation, business, securities advice) typically triggers registration requirements unless an exemption applies.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-24",
      "question": "A Grantor Retained Annuity Trust (GRAT) allows:",
      "options": [
        "Direct gifts to heirs free of estate tax",
        "The grantor to transfer assets to a trust, receive annuity payments, and pass remaining assets to heirs estate-tax-free if assets outperform the IRS 7520 rate",
        "Heirs to receive assets immediately at death",
        "Conversion of ordinary income to capital gains"
      ],
      "correct": 1,
      "explanation": "A GRAT transfers appreciation to heirs estate-tax-free. The grantor receives annuity payments for a term. If trust assets grow faster than the IRS §7520 hurdle rate, the excess passes to heirs free of gift and estate tax. A \"zeroed-out GRAT\" minimizes gift tax on the transfer.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-25",
      "question": "The annual federal gift tax exclusion in 2024 is:",
      "options": [
        "$10,000 per recipient",
        "$18,000 per recipient from any single donor",
        "$50,000 per recipient",
        "Unlimited between spouses"
      ],
      "correct": 1,
      "explanation": "The 2024 annual gift tax exclusion is $18,000 per recipient. A donor can give $18,000 to as many individuals as desired without filing a gift tax return or using their lifetime exemption ($13.61M in 2024). Married couples can split gifts ($36,000 per recipient). Gifts to U.S. citizen spouses are unlimited.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-26",
      "question": "A Charitable Remainder Trust (CRT) allows a donor to:",
      "options": [
        "Give assets to charity immediately and receive no benefit",
        "Transfer appreciated assets to a trust, receive income for life or a term, and pass remaining assets to a charity — receiving a partial charitable deduction",
        "Avoid all capital gains taxes on any asset",
        "Give assets to heirs tax-free with no charitable obligation"
      ],
      "correct": 1,
      "explanation": "A CRT allows a donor to transfer appreciated assets (avoiding immediate capital gains tax), receive an income stream for life or a specified term, receive an upfront partial charitable deduction, and have the remainder pass to the named charity. It is an excellent tool for diversifying concentrated positions charitably.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-27",
      "question": "What is the \"unified credit\" in estate and gift tax?",
      "options": [
        "A credit that combines income and estate taxes",
        "The lifetime exemption amount ($13.61M in 2024) that can be applied against both gift and estate taxes during a lifetime and at death",
        "A tax credit for charitable giving",
        "An IRS credit for overpaid taxes"
      ],
      "correct": 1,
      "explanation": "The unified credit (unified applicable exclusion amount) is the lifetime exemption available to offset gift and estate taxes. In 2024, it is $13.61M per person ($27.22M for married couples with portability). Gifts exceeding annual exclusions reduce the lifetime exemption. This amount is set to revert to approximately $7M (inflation-adjusted) after 2025 under current law.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-28",
      "question": "A client with an irrevocable life insurance trust (ILIT) benefits because:",
      "options": [
        "The trust pays no income tax",
        "Life insurance proceeds in the ILIT are excluded from the insured's taxable estate, while heirs receive liquidity to pay estate taxes",
        "The insured can change beneficiaries at any time",
        "The ILIT eliminates all estate taxes"
      ],
      "correct": 1,
      "explanation": "An ILIT holds life insurance outside the insured's taxable estate. At death, proceeds pass to the trust estate-tax-free, providing heirs with liquidity to pay estate taxes or receive outright. To work properly, the insured must not retain any \"incidents of ownership\" in the policy, and the 3-year rule must be satisfied if the policy is transferred to the trust.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-29",
      "question": "The \"output gap\" in economics refers to:",
      "options": [
        "The difference between imports and exports",
        "The difference between actual GDP and potential GDP — a positive gap indicates inflationary pressure",
        "The gap between short- and long-term interest rates",
        "The federal budget deficit"
      ],
      "correct": 1,
      "explanation": "The output gap measures the difference between an economy's actual output and its potential output (what it could produce at full employment). A positive output gap (actual > potential) indicates inflationary pressure. A negative gap (actual < potential) indicates slack and potential for stimulus.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-30",
      "question": "Quantitative easing (QE) involves:",
      "options": [
        "Raising the federal funds rate",
        "The Fed purchasing large quantities of securities (Treasuries, MBS) to inject liquidity and lower long-term rates",
        "The Treasury issuing new bonds to fund spending",
        "Congress cutting taxes to stimulate the economy"
      ],
      "correct": 1,
      "explanation": "QE is a monetary policy tool where the Fed purchases large quantities of longer-term securities (government bonds, mortgage-backed securities) to inject money into the financial system. This lowers long-term rates, encourages lending, and supports asset prices when short-term rates are already near zero.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-31",
      "question": "The \"velocity of money\" refers to:",
      "options": [
        "How quickly the Fed can change interest rates",
        "The rate at which money circulates through the economy — how frequently each dollar is spent in a given period",
        "The speed at which stocks trade on exchanges",
        "The lag time between Fed action and economic impact"
      ],
      "correct": 1,
      "explanation": "Velocity of money measures how frequently a unit of currency circulates through the economy (V = GDP / Money Supply). High velocity means money is changing hands rapidly, potentially amplifying the effect of money supply changes. Low velocity (as seen post-2008) can limit the inflationary impact of money creation.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-32",
      "question": "A \"material\" piece of information in securities law is defined as:",
      "options": [
        "Any information about a company",
        "Information where there is a substantial likelihood that a reasonable investor would consider it important in making an investment decision",
        "Only quarterly earnings reports",
        "Information that changes a stock's price by more than 5%"
      ],
      "correct": 1,
      "explanation": "Under SEC v. Basic Inc. (1988) and TSC Industries v. Northway (1976), information is \"material\" if there is a substantial likelihood that a reasonable investor would consider it important in making an investment decision, or if it would have significantly altered the total mix of available information.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-33",
      "question": "The \"fiduciary exception\" to attorney-client privilege in ERISA means:",
      "options": [
        "ERISA plans don't need attorneys",
        "Documents prepared in furtherance of the fiduciary function (not litigation) may not be privileged in disputes with plan beneficiaries",
        "Plan administrators have absolute attorney-client privilege",
        "Attorneys cannot represent ERISA plans"
      ],
      "correct": 1,
      "explanation": "Under the fiduciary exception to attorney-client privilege, documents prepared in connection with the performance of fiduciary duties (not litigation defense) may not be protected from discovery by plan participants. The rationale: plan participants are the true clients of the fiduciary, not the plan sponsor.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-34",
      "question": "What is \"front-running\" in securities trading?",
      "options": [
        "Being the first firm to execute a large block trade",
        "Trading for personal account based on knowledge of a pending large customer order that will likely move the market",
        "Short selling before a market decline",
        "Executing trades at the opening of the market"
      ],
      "correct": 1,
      "explanation": "Front-running is illegal and unethical trading where a broker or adviser executes trades for their own account based on advance knowledge of pending customer orders. For example, buying stock for personal account before executing a large customer buy order that will drive up the price. It violates fiduciary duty and securities laws.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-35",
      "question": "The \"cherry-picking\" violation in investment management involves:",
      "options": [
        "Selecting only the best mutual funds for clients",
        "Allocating profitable trades to favored accounts and unprofitable trades to less-favored accounts after knowing the trade outcome",
        "Recommending only technology stocks",
        "Selecting securities based on analyst ratings alone"
      ],
      "correct": 1,
      "explanation": "Cherry-picking is a fraudulent trade allocation practice where advisers wait to see if a trade is profitable before deciding which account gets it. Profitable trades are assigned to favored accounts (personal, preferred clients); unprofitable ones to disfavored accounts. SEC Rule 17j-1 and Advisers Act §204A-1 address these conflicts.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-36",
      "question": "The Treynor ratio differs from the Sharpe ratio in that Treynor:",
      "options": [
        "Uses standard deviation as the risk measure",
        "Uses beta (systematic risk) as the denominator — measuring excess return per unit of MARKET risk, not total risk",
        "Measures absolute return rather than risk-adjusted return",
        "Only applies to bond portfolios"
      ],
      "correct": 1,
      "explanation": "Treynor ratio = (Portfolio Return − Risk-Free Rate) / Beta. It measures return per unit of systematic (market) risk. Unlike Sharpe (which uses total risk/standard deviation), Treynor is appropriate when comparing well-diversified portfolios where unsystematic risk has been eliminated. For poorly diversified portfolios, Sharpe is more appropriate.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-37",
      "question": "A \"tactical asset allocation\" strategy differs from strategic asset allocation in that:",
      "options": [
        "Tactical is fixed for the entire investment horizon",
        "Tactical involves short-term deviations from the long-term target allocation to exploit perceived market opportunities",
        "Tactical allocation never changes the equity percentage",
        "Tactical is used only for bond portfolios"
      ],
      "correct": 1,
      "explanation": "Strategic asset allocation sets long-term target weights (e.g., 60/40) based on investor objectives. Tactical asset allocation involves short-term tilts away from these targets based on market conditions, valuations, or economic views. Tactical adjustments are typically within defined ranges (e.g., ±10%) and are rebalanced back to strategic targets over time.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-38",
      "question": "The \"liability-driven investing\" (LDI) approach is primarily used by:",
      "options": [
        "Retail investors seeking maximum returns",
        "Pension funds and insurance companies matching asset duration to liability duration to minimize funded status volatility",
        "Hedge funds using leverage",
        "Technology company endowments"
      ],
      "correct": 1,
      "explanation": "LDI is an investment strategy where the primary goal is to match assets to liabilities in terms of duration, cash flows, and risk characteristics. It's widely used by defined-benefit pension plans and insurance companies that have specific future payment obligations. The key metric is funded status volatility, not absolute return.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-39",
      "question": "A \"factor investing\" strategy (smart beta) seeks to:",
      "options": [
        "Replicate a standard market index exactly",
        "Systematically tilt toward specific risk factors (value, momentum, size, quality, low volatility) that have historically earned excess returns over time",
        "Beat the market using fundamental stock analysis",
        "Invest only in the highest-yielding securities regardless of risk"
      ],
      "correct": 1,
      "explanation": "Factor investing (smart beta) systematically tilts toward factors — such as value (low P/B or P/E), momentum (recent outperformers), size (small-cap), quality (high ROE, low debt), and low volatility — that have historically earned risk premiums over market cap-weighted indexes. It blends active and passive approaches with lower costs than traditional active management.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-40",
      "question": "Under GIPS (Global Investment Performance Standards), composite returns must include:",
      "options": [
        "Only the best-performing accounts",
        "All actual, fee-paying, discretionary portfolios managed according to the same strategy — preventing cherry-picking",
        "Only accounts with over $1M in assets",
        "Hypothetical and backtested results"
      ],
      "correct": 1,
      "explanation": "GIPS (published by CFA Institute) requires that composites include ALL actual, fee-paying, discretionary portfolios managed according to a similar investment mandate. This prevents firms from cherry-picking only their best-performing accounts to show to prospects. Composite returns must be asset-weighted.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-41",
      "question": "The \"endowment model\" of investing (Yale Model) emphasizes:",
      "options": [
        "Maximum fixed income allocation for stability",
        "Heavy allocation to alternative assets (private equity, real estate, hedge funds, natural resources) for higher risk-adjusted returns and diversification",
        "Index funds exclusively to minimize costs",
        "100% equity exposure for long-term growth"
      ],
      "correct": 1,
      "explanation": "The Yale Endowment Model (developed by David Swensen) allocates heavily to illiquid alternative assets — private equity, venture capital, real estate, hedge funds, and natural resources — seeking higher risk-adjusted returns and diversification beyond public markets. The long investment horizon of endowments allows tolerance for illiquidity premiums.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-42",
      "question": "A \"benchmark hugging\" manager is one who:",
      "options": [
        "Consistently outperforms their benchmark",
        "Closely mirrors the benchmark while charging active management fees — delivering little active management value for the higher cost",
        "Uses passive indexing exclusively",
        "Avoids benchmarks entirely in their investment process"
      ],
      "correct": 1,
      "explanation": "Benchmark huggers (\"closet indexers\") hold portfolios closely resembling their benchmark while charging active management fees. Active share (the percentage of the portfolio differing from the benchmark) is used to identify closet indexers — low active share combined with high fees destroys investor value. Investors can access near-identical returns through index funds at a fraction of the cost.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-43",
      "question": "The \"disposition effect\" in behavioral finance describes investors' tendency to:",
      "options": [
        "Invest only in familiar companies",
        "Sell winners too early and hold losers too long — driven by loss aversion and the desire to realize gains while avoiding realizing losses",
        "Overreact to recent news",
        "Follow the crowd into popular investments"
      ],
      "correct": 1,
      "explanation": "The disposition effect (Shefrin & Statman, 1985) is the tendency for investors to sell securities that have increased in value (locking in gains — feels good) while holding securities that have declined (avoiding realizing losses — feels painful). This contradicts rational tax-efficient investing (which would hold winners and harvest losses) and leads to suboptimal portfolio decisions.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-44",
      "question": "The \"anchoring bias\" in investment decision-making occurs when:",
      "options": [
        "Investors prefer domestic investments",
        "Investors place excessive weight on an initial piece of information when making subsequent decisions — such as anchoring to a purchase price rather than current value",
        "Investors follow recent market trends",
        "Investors prefer liquid investments"
      ],
      "correct": 1,
      "explanation": "Anchoring bias is the tendency to rely too heavily on the first piece of information encountered (the \"anchor\") when making decisions. In investing, anchoring to a purchase price leads investors to make irrational sell decisions based on where they bought rather than the security's current intrinsic value or prospects.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-45",
      "question": "Herding behavior in financial markets refers to:",
      "options": [
        "Investing in agriculture-related securities",
        "Investors following the crowd — buying what others are buying and selling what others are selling, often amplifying market movements and contributing to bubbles and crashes",
        "Institutional investors coordinating investment strategies",
        "Diversifying across multiple asset managers"
      ],
      "correct": 1,
      "explanation": "Herding occurs when investors follow the crowd regardless of their own information or analysis. It can amplify market trends (contributing to bubbles on the way up and crashes on the way down). Professional fund managers may herd to minimize career risk — it's easier to justify being wrong when everyone is wrong together.",
      "points": 20
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-46",
      "question": "Under the Investment Advisers Act, an adviser acting as both broker-dealer and investment adviser in the same transaction (principal transaction) must:",
      "options": [
        "Simply execute the transaction",
        "Disclose the principal capacity to the client in writing and obtain client consent before or at the time of the transaction",
        "File a report with the SEC for each such transaction",
        "Charge only the standard commission rate"
      ],
      "correct": 1,
      "explanation": "When an RIA (also registered as a broker-dealer) acts as principal in a transaction with a client (selling from or buying for its own account), it must: disclose the capacity in writing; disclose any remuneration received; and obtain client consent before or at completion of the transaction. This addresses the conflict between dealer profits and client best interest.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-47",
      "question": "The Investment Advisers Act requires a \"brochure supplement\" (Form ADV Part 2B) to be delivered for:",
      "options": [
        "Every employee of the RIA",
        "Supervised persons who formulate investment advice or have direct client contact",
        "Only the firm's CEO and CIO",
        "Outside directors of the RIA"
      ],
      "correct": 1,
      "explanation": "Form ADV Part 2B (brochure supplement) must be delivered for each supervised person who provides investment advice directly to the client or whose investment advice is directly supervised by someone who does. It covers educational background, business experience, disciplinary history, and outside business activities of individual advisers.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-48",
      "question": "A \"scalping\" violation by an investment adviser involves:",
      "options": [
        "Charging excessive fees",
        "Recommending securities to clients, then rapidly buying and selling them in the adviser's own account based on anticipated price movement caused by the client's purchases",
        "Excessive trading in client accounts",
        "Trading in foreign markets"
      ],
      "correct": 1,
      "explanation": "Scalping is when an adviser recommends a security to clients (knowing the client buying will move the price), purchases the security for their own account before the client order (front-running), and then sells after the client's purchase has moved the price. It violates fiduciary duty, misappropriation theory, and Rule 10b-5.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-49",
      "question": "An \"accredited investor\" determination for a Reg D offering must be based on:",
      "options": [
        "The investor's verbal statement alone",
        "Reasonable belief by the issuer based on information provided — for 506(c) offerings, the issuer must take reasonable steps to verify accredited status through objective documentation",
        "SEC certification of the investor's status",
        "The investor's FINRA registration status"
      ],
      "correct": 1,
      "explanation": "For 506(b) offerings, issuers may rely on investor self-certification of accredited status. For 506(c) offerings (allowing general solicitation), issuers must take \"reasonable steps\" to verify accredited status — such as reviewing tax returns, W-2s, bank/brokerage statements, or obtaining written confirmation from a licensed attorney, CPA, or registered broker-dealer.",
      "points": 25
    },
    {
      "exam": "Series 65",
      "domain": "Legacy Foundation",
      "difficulty": "advisor",
      "cooldown": 30,
      "topicTag": "legacy-advanced-50",
      "question": "The \"three-factor model\" developed by Fama and French expands CAPM by adding:",
      "options": [
        "Inflation and interest rate factors",
        "Size (small-minus-big) and value (high-minus-low book-to-price) factors to market risk (beta)",
        "Momentum and quality factors",
        "Sector and geography factors"
      ],
      "correct": 1,
      "explanation": "The Fama-French Three-Factor Model adds two factors to CAPM: (1) SMB (Small Minus Big) — small-cap stocks historically outperform large-cap; and (2) HML (High Minus Low) — value stocks (high book-to-market) historically outperform growth stocks. Carhart (1997) later added momentum as a fourth factor.",
      "points": 25
    }
  ],
  "expert": [
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-1",
      "question": "A futures contract differs from an options contract in that a futures contract:",
      "options": [
        "Gives the holder the right but not obligation to transact",
        "Obligates BOTH parties to transact at the agreed price on the specified date — no option to walk away",
        "Can only be settled in cash, never physical delivery",
        "Is only available on equity indexes"
      ],
      "correct": 1,
      "explanation": "Futures contracts create binding obligations for both buyer and seller. The buyer must buy and the seller must sell at the agreed price and date (or offset the contract). Options give the buyer a RIGHT, not obligation. Futures are used for hedging and speculation on commodities, currencies, rates, and equity indexes.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-2",
      "question": "An interest rate swap involves:",
      "options": [
        "Exchanging equity positions between counterparties",
        "Two parties exchanging fixed-rate interest payments for floating-rate payments on a notional principal amount — no principal is exchanged",
        "The Fed setting a new base rate",
        "A mutual fund switching from bonds to stocks"
      ],
      "correct": 1,
      "explanation": "An interest rate swap is an OTC derivative where one party pays a fixed rate and receives a floating rate (typically SOFR) from the counterparty on an agreed notional principal. No principal is exchanged. Corporations use swaps to manage interest rate exposure on floating-rate debt.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-3",
      "question": "A credit default swap (CDS) functions as:",
      "options": [
        "A loan between two banks",
        "A form of insurance where the protection buyer pays periodic premiums to the protection seller in exchange for a payment if a specified credit event (default) occurs",
        "A currency exchange agreement",
        "A forward contract on interest rates"
      ],
      "correct": 1,
      "explanation": "A CDS transfers credit risk from buyer to seller. The protection buyer pays periodic premiums; the protection seller compensates the buyer if the reference entity defaults. CDSs were widely blamed for amplifying the 2008 financial crisis due to unhedged seller exposures. They are OTC derivatives regulated under Dodd-Frank.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-4",
      "question": "The Black-Scholes model for option pricing requires the following inputs EXCEPT:",
      "options": [
        "Current stock price",
        "Strike price",
        "Dividend yield of the underlying",
        "Analyst earnings estimate for the next quarter"
      ],
      "correct": 3,
      "explanation": "The Black-Scholes model requires: current stock price, strike price, time to expiration, risk-free interest rate, and implied volatility (or actual historical volatility). It also can incorporate dividend yield. Analyst earnings estimates are fundamental analysis inputs — not part of the options pricing model.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-5",
      "question": "Backwardation in futures markets means:",
      "options": [
        "Futures prices are higher than the expected future spot price",
        "Futures prices are LOWER than the current spot price — the opposite of contango",
        "All futures contracts are trading below par value",
        "The futures market is closed to new participants"
      ],
      "correct": 1,
      "explanation": "Backwardation occurs when futures prices are below the current spot price — the futures curve slopes downward. This often happens in commodity markets when there is immediate supply shortage. Contango (the opposite) is the more common condition where futures trade above spot due to carrying costs.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-6",
      "question": "A variance swap allows counterparties to trade:",
      "options": [
        "Fixed income securities for equities",
        "Realized volatility against implied volatility — the buyer benefits if actual volatility exceeds the agreed strike level",
        "Currency exchange at fixed rates",
        "Interest rate risk for credit risk"
      ],
      "correct": 1,
      "explanation": "A variance swap pays the difference between realized variance (squared volatility) and the agreed strike variance. Unlike options on volatility, variance swaps provide pure exposure to volatility without delta hedging. Buyers benefit when actual market volatility exceeds what was priced at inception.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-7",
      "question": "An investment adviser with $110M+ AUM must register with:",
      "options": [
        "FINRA only",
        "The SEC under the Investment Advisers Act of 1940",
        "State securities regulators only",
        "The OCC"
      ],
      "correct": 1,
      "explanation": "The Dodd-Frank Act raised the SEC registration threshold to $110M AUM. Form ADV (Parts 1, 2A, 2B, and CRS) must be filed and updated annually. Advisers between $25M–$110M generally register at the state level. The \"buffer\" between $100M and $110M allows advisers to stay with the SEC if they recently crossed $100M.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-8",
      "question": "Form ADV Part 2A must be delivered to clients:",
      "options": [
        "Only upon client request",
        "Before or at the time of entering the advisory agreement, and annually within 120 days of fiscal year-end",
        "Only when material changes occur",
        "Once per relationship with no ongoing requirement"
      ],
      "correct": 1,
      "explanation": "Rule 204-3 under the Advisers Act requires RIAs to deliver Form ADV Part 2A (the firm brochure) at or before entering an advisory agreement, and annually within 120 days of fiscal year-end. If material changes occur, clients must be promptly notified. Part 2B covers individual advisers' backgrounds.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-9",
      "question": "The SEC's Marketing Rule (Rule 206(4)-1, revised 2021) governs:",
      "options": [
        "How advisers calculate performance returns only",
        "All investment adviser marketing communications and advertisements, including testimonials, third-party ratings, and performance presentations",
        "Only television and print advertising",
        "Only communications to institutional investors"
      ],
      "correct": 1,
      "explanation": "The revised Marketing Rule (effective 2021) replaced the old advertising and cash solicitation rules. It covers all adviser marketing communications, permits testimonials and endorsements with specific disclosures, establishes performance presentation requirements, and imposes substantiation requirements. It applies to all adviser communications intended to obtain/retain clients.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-10",
      "question": "Under the Investment Advisers Act, the \"de minimis\" exemption from state registration applies when:",
      "options": [
        "An adviser has fewer than 15 clients",
        "An adviser has fewer than 5 clients from a state in the preceding 12 months and does not have a place of business in the state",
        "An adviser manages less than $1M",
        "An adviser only provides advice on government securities"
      ],
      "correct": 1,
      "explanation": "The de minimis exemption (Section 203A of the Advisers Act) allows advisers to avoid state registration in states where they have fewer than 5 clients in the past 12 months and no place of business in that state. This prevents advisers from having to register in every state where they have minimal activity.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-11",
      "question": "ERISA Section 3(38) fiduciary investment managers differ from 3(21) advisers in that:",
      "options": [
        "3(38) managers have less responsibility",
        "3(38) managers have full discretionary authority and assume fiduciary liability for investment decisions, while 3(21) advisers only provide non-discretionary advice with the plan retaining ultimate decision authority",
        "3(21) advisers always charge higher fees",
        "3(38) and 3(21) have identical responsibilities"
      ],
      "correct": 1,
      "explanation": "A 3(38) investment manager is appointed in writing and has full discretionary authority over plan assets, accepting full fiduciary responsibility for investment decisions. A 3(21) functional fiduciary provides non-discretionary investment advice — the plan sponsor remains responsible for final decisions. 3(38) status shifts more liability to the manager.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-12",
      "question": "A qualified opportunity zone (QOZ) investment allows investors to:",
      "options": [
        "Avoid all capital gains on any investment",
        "Defer and potentially reduce capital gains by reinvesting in a Qualified Opportunity Fund, with gains on the QOF itself excluded if held 10+ years",
        "Immediately eliminate all estate taxes",
        "Convert ordinary income to capital gains"
      ],
      "correct": 1,
      "explanation": "QOZ investments (created by the Tax Cuts and Jobs Act 2017) allow investors to: (1) defer original capital gains by reinvesting in a QOF within 180 days; (2) reduce deferred gains by 10% if held 5 years; and (3) exclude ALL gains on the QOF investment itself if held 10+ years. The basis on original deferred gains was stepped up to FMV in 2026.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-13",
      "question": "A Spousal Lifetime Access Trust (SLAT) provides:",
      "options": [
        "Tax benefits only for single individuals",
        "An irrevocable trust that removes assets from the grantor's estate while allowing the spouse access to trust assets during their lifetime",
        "A way to avoid all estate and gift taxes permanently",
        "A revocable trust with no estate tax benefit"
      ],
      "correct": 1,
      "explanation": "A SLAT allows one spouse (grantor) to make a taxable gift to an irrevocable trust while the other spouse (beneficiary) can access trust assets during their lifetime. This removes assets from the grantor's estate while maintaining indirect access through the beneficiary spouse. Risk: if the beneficiary spouse dies or the couple divorces, access is lost.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-14",
      "question": "The \"basis consistency rules\" under IRC §1014(f) require:",
      "options": [
        "All inherited assets to be sold immediately",
        "Heirs to use an estate tax value consistent with the value reported on the estate tax return (Form 706) as their cost basis for inherited assets",
        "All inherited assets to be reported at zero basis",
        "No consistency between estate and income tax reporting"
      ],
      "correct": 1,
      "explanation": "The PATH Act (2015) added IRC §1014(f) requiring that the income tax basis of inherited property cannot exceed the value reported for estate tax purposes on Form 706. This prevents heirs from claiming a stepped-up basis higher than what the estate declared for estate tax purposes. Executors must provide beneficiaries with basis information on Form 8971.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-15",
      "question": "A 678 trust (beneficiary-controlled trust) allows the trust beneficiary to:",
      "options": [
        "Revoke the trust at any time",
        "Exercise a Crummey power to withdraw contributions, making the beneficiary the grantor for income tax purposes — income is taxed to the beneficiary, not the trust",
        "Avoid all capital gains taxes",
        "Transfer trust assets to heirs free of estate tax"
      ],
      "correct": 1,
      "explanation": "Under IRC §678, a person who has an unrestricted right to withdraw trust corpus or income is treated as the owner (grantor) of the trust for income tax purposes. This allows income to be taxed at the beneficiary's rate (potentially lower) rather than the compressed trust tax rates. Commonly used in dynasty trusts where beneficiaries have withdrawal rights.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-16",
      "question": "Reg D Rule 506(b) vs. 506(c) — the key difference is:",
      "options": [
        "506(b) allows general solicitation; 506(c) does not",
        "506(c) allows general solicitation but restricts sales to VERIFIED accredited investors; 506(b) prohibits general solicitation but allows up to 35 non-accredited sophisticated investors",
        "Both rules are identical in requirements",
        "506(b) is for equity; 506(c) is for debt securities only"
      ],
      "correct": 1,
      "explanation": "Rule 506(b) prohibits general solicitation (no advertising) but allows up to 35 non-accredited sophisticated investors alongside unlimited accredited investors. Rule 506(c) permits general solicitation but ALL purchasers must be verified accredited investors, and the issuer must take reasonable steps to verify accredited status (beyond self-certification).",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-17",
      "question": "A \"qualified purchaser\" under the Investment Company Act requires:",
      "options": [
        "$1M in investable assets",
        "An individual with $5M+ in investments or an entity with $25M+ in investments — providing access to Section 3(c)(7) funds",
        "Completion of a Series 65 exam",
        "Net worth over $10M"
      ],
      "correct": 1,
      "explanation": "Qualified Purchaser (QP) status under ICA §2(a)(51) requires: individuals with $5M+ in investments (not net worth), or entities with $25M+ in investments. QPs can access Section 3(c)(7) funds (hedge funds, PE). This is a higher bar than accredited investor ($1M net worth), which accesses Reg D offerings.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-18",
      "question": "ERISA's prudent expert standard requires a plan fiduciary to act with:",
      "options": [
        "The care a reasonable layperson would use",
        "The care, skill, prudence, and diligence that a prudent person familiar with such matters and acting in a similar capacity would use in similar circumstances",
        "Maximum caution, investing only in government securities",
        "Whatever the plan document states, even if imprudent"
      ],
      "correct": 1,
      "explanation": "ERISA §404 imposes a \"prudent expert\" standard — not merely a reasonable layperson standard. Fiduciaries must act as someone with expertise in managing retirement assets would act. This means professional-level care in investment selection, monitoring, diversification, and cost management. Ignorance is not a defense — an inexperienced fiduciary must get help.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-19",
      "question": "Under UPIA (Uniform Prudent Investor Act), a trustee managing an irrevocable trust must:",
      "options": [
        "Maximize returns regardless of risk",
        "Diversify assets unless clearly prudent not to, and manage for risk/return tradeoff across the entire portfolio — not individual investments",
        "Follow only the trust document even if investments become imprudent",
        "Invest primarily in guaranteed products to protect principal"
      ],
      "correct": 1,
      "explanation": "The UPIA (adopted in most states) establishes that trustees must: diversify unless clearly imprudent not to; evaluate investments as part of the total portfolio (not in isolation); consider the risk/return tradeoff appropriate to the trust's purposes; and manage costs. The trustee's personal preferences are completely irrelevant.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-20",
      "question": "The \"absolute return\" strategy in hedge funds differs from traditional long-only strategies because:",
      "options": [
        "Absolute return funds only invest in government bonds",
        "Absolute return funds aim to generate positive returns regardless of market direction, using long/short, derivatives, and other strategies uncorrelated to benchmarks",
        "Absolute return funds always outperform the market",
        "Absolute return funds are not regulated by the SEC"
      ],
      "correct": 1,
      "explanation": "Absolute return strategies attempt to generate positive returns regardless of overall market conditions — they are not benchmarked to an index. They use tools unavailable to traditional long-only managers: short selling, leverage, derivatives, and arbitrage strategies. Success is measured by absolute return (ideally positive in all environments), not relative performance.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-21",
      "question": "The Series 66 exam qualifies candidates as:",
      "options": [
        "A registered representative and general securities principal",
        "Both an investment adviser representative (IAR) and a securities agent (broker) at the state level",
        "An options principal and compliance officer",
        "A municipal securities representative and futures trader"
      ],
      "correct": 1,
      "explanation": "The Series 66 (Uniform Combined State Law Examination) qualifies candidates as both an IAR (under the Uniform Securities Act) and a securities agent/registered representative at the state level. It combines the Series 63 (agent registration) and Series 65 (IAR) content — a broker-dealer can use Series 7 + Series 66.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-22",
      "question": "Under the Uniform Securities Act, which of the following advisers is NOT required to register with the state?",
      "options": [
        "An adviser with 6 clients in the state",
        "A federally-covered investment adviser (SEC-registered) — exempt from state registration except for filing requirements and fees",
        "Any adviser managing under $25M",
        "An adviser who provides advice only to exempt clients"
      ],
      "correct": 1,
      "explanation": "Federally-covered investment advisers (SEC-registered RIAs) are exempt from state registration under the Uniform Securities Act (National Securities Markets Improvement Act of 1996 — NSMIA). However, they must still file required notice filings with states and pay state fees.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-23",
      "question": "Solicitor disclosure requirements under the Advisers Act require:",
      "options": [
        "No specific disclosures if recommendations are suitable",
        "A written solicitor agreement, delivery of the adviser's Form ADV brochure, a separate written disclosure of the solicitor relationship and compensation, and client acknowledgment",
        "Only verbal disclosure to clients",
        "Prior SEC approval for each solicitation arrangement"
      ],
      "correct": 1,
      "explanation": "Under SEC Advisers Act Rule 206(4)-3 (updated by 2022 Marketing Rule), cash solicitation arrangements require: written agreement between adviser and solicitor; delivery of Form ADV brochure; a separate disclosure document describing the arrangement and compensation; and client signed acknowledgment. The solicitor must also comply with Reg BI if a broker-dealer.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-24",
      "question": "The \"pay-to-play\" rule (SEC Rule 206(4)-5) restricts investment advisers from:",
      "options": [
        "Charging performance fees",
        "Providing investment management services to a government client for 2 years after making a political contribution to an official who can influence that government's investment decisions",
        "Advertising to government pension funds",
        "Accepting placement agent fees"
      ],
      "correct": 1,
      "explanation": "The pay-to-play rule prohibits advisers from receiving compensation for managing government client funds for 2 years after the adviser (or covered associates) makes a political contribution to an official with investment decision authority. This addresses the conflict between political contributions and government contract awards.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-25",
      "question": "The net investment income tax (NIIT) of 3.8% applies to:",
      "options": [
        "All capital gains regardless of income",
        "Net investment income of individuals with MAGI above $200K ($250K married) — including interest, dividends, capital gains, rents, and royalties",
        "Only foreign-source investment income",
        "Ordinary income above $400,000"
      ],
      "correct": 1,
      "explanation": "The NIIT (IRC §1411) is a 3.8% surtax on the lesser of net investment income or the amount by which MAGI exceeds the threshold ($200K single, $250K MFJ). Net investment income includes interest, dividends, capital gains, rents, royalties, and passive activity income. It applies on top of regular capital gains rates.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-26",
      "question": "A solicitor arrangement under the Advisers Act requires the solicitor to:",
      "options": [
        "Be a registered investment adviser",
        "Deliver the adviser's Form ADV brochure AND a separate solicitor disclosure document to the client",
        "Provide free financial advice to compensate for the conflict",
        "Have prior SEC approval for each client referral"
      ],
      "correct": 1,
      "explanation": "Under SEC Rule 206(4)-3 (now integrated into the Marketing Rule), solicitors must: deliver the adviser's brochure AND a separate written disclosure describing the arrangement and compensation. The client must acknowledge receiving the solicitor disclosure. The adviser must also have reasonable belief the solicitor is not subject to disqualification.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-27",
      "question": "Variable life insurance differs from whole life insurance in that:",
      "options": [
        "Variable life has no death benefit",
        "Variable life allows the policyholder to allocate premiums among investment subaccounts — the cash value and potentially the death benefit fluctuate with investment performance",
        "Variable life premiums are always lower",
        "Variable life has no cash value component"
      ],
      "correct": 1,
      "explanation": "Variable life insurance allows policyholders to invest cash value in subaccounts (similar to mutual funds). Cash value and potentially the death benefit vary with investment performance. Because it is an investment product, variable life requires a securities license (Series 6 or 7) to sell. The minimum death benefit is guaranteed; cash value is not.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-28",
      "question": "A \"concentrated stock position\" risk management strategy using a 10b5-1 plan works by:",
      "options": [
        "Immediately selling all shares in a single transaction",
        "Pre-establishing a written plan for future stock sales at a time when the seller is not aware of material non-public information, providing an affirmative defense against insider trading claims",
        "Donating all shares to charity at once",
        "Swapping shares for cash through the company"
      ],
      "correct": 1,
      "explanation": "SEC Rule 10b5-1 allows insiders (officers, directors, large shareholders) to establish a pre-planned trading program when they are not in possession of MNPI. Once established, trades can proceed automatically even if the insider later becomes aware of MNPI. The SEC tightened 10b5-1 rules in 2023, adding cooling-off periods and certification requirements.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-29",
      "question": "Under IRC §1202, qualified small business stock (QSBS) may allow shareholders to exclude from federal tax:",
      "options": [
        "25% of gains",
        "Up to 100% of capital gains (up to $10M or 10× basis) if certain holding and eligibility requirements are met",
        "All ordinary income",
        "Only gains below $1M"
      ],
      "correct": 1,
      "explanation": "Section 1202 QSBS exclusion allows shareholders to exclude up to 100% of capital gains (up to $10M or 10× adjusted basis) from federal income tax if the stock was: original issue C-corporation stock held more than 5 years; the company had $50M or less in assets when stock was issued; and the company meets active business requirements in specified industries.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-30",
      "question": "When an investment adviser is a \"deemed fiduciary\" under ERISA due to providing investment advice to a plan for a fee, they must satisfy:",
      "options": [
        "Only the suitability standard",
        "The ERISA fiduciary standard — acting solely in the interest of plan participants and for the exclusive purpose of providing benefits — plus any applicable prohibited transaction exemptions",
        "Only Reg BI requirements",
        "No special requirements beyond standard advisory duty"
      ],
      "correct": 1,
      "explanation": "When an investment adviser meets the five-part test to be a functional fiduciary under ERISA §3(21), they are subject to ERISA's strict standards: sole interest of participants, exclusive benefit purpose, diversification, prudent expert standard, and plan document compliance. They must also comply with PTE 2020-02 for IRA rollover recommendations.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-31",
      "question": "The \"look-through\" rule for mutual funds in retirement plans means:",
      "options": [
        "Plan administrators can see which employees hold which funds",
        "Mutual fund shares held by a plan must be analyzed as if the plan directly held the underlying securities for purposes of determining fiduciary responsibility and prohibited transactions",
        "All mutual fund investments are exempt from ERISA",
        "Plan participants can see all fund manager compensation"
      ],
      "correct": 1,
      "explanation": "The look-through rule treats a plan's investment in a mutual fund as if the plan directly held the fund's underlying assets for certain ERISA purposes (plan asset rule). This determines whether the fund itself is subject to ERISA fiduciary requirements. Registered investment companies (mutual funds) are generally exempt from the plan asset rule under a specific DOL exemption.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-32",
      "question": "A \"clawback\" provision in executive compensation requires:",
      "options": [
        "An executive to work a minimum number of years",
        "Recovery of previously paid incentive compensation from executives in the event of financial restatements or misconduct — mandated by Dodd-Frank and SEC Rule 10D-1",
        "Additional bonus payments if performance exceeds targets",
        "Equal pay for all executives regardless of performance"
      ],
      "correct": 1,
      "explanation": "Dodd-Frank §954 (implemented by SEC Rule 10D-1, effective 2023) requires listed companies to adopt policies to recover (claw back) excess incentive compensation paid to current or former executive officers within 3 years preceding a financial restatement, regardless of whether the executive was at fault. This is a strict liability standard — no misconduct required.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-33",
      "question": "Under the Employee Retirement Income Security Act (ERISA), a \"prohibited transaction\" includes:",
      "options": [
        "Investing plan assets in publicly traded stocks",
        "The sale, exchange, or lease of property between the plan and a party in interest; loans to parties in interest; and using plan assets for the benefit of a party in interest",
        "Any investment in international securities",
        "Hiring an independent investment manager"
      ],
      "correct": 1,
      "explanation": "ERISA §406 prohibits transactions between the plan and \"parties in interest\" (plan fiduciaries, plan sponsor, service providers, etc.) including: selling/buying/leasing property; loans; furnishing goods/services; and using plan assets to benefit a party in interest. These transactions require a prohibited transaction exemption (PTE) from the DOL to be permissible.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-34",
      "question": "Form CRS (Client Relationship Summary) is required to be delivered by:",
      "options": [
        "Only RIAs with over $1B AUM",
        "Both SEC-registered investment advisers AND broker-dealers to retail investors, describing the types of services, fees, conflicts, standards of conduct, and disciplinary history",
        "Only broker-dealers",
        "Only when a retail investor requests it"
      ],
      "correct": 1,
      "explanation": "Form CRS (adopted as part of Reg BI) must be delivered by both SEC-registered investment advisers and registered broker-dealers to retail investors at or before the beginning of the relationship. It is a standardized 2-4 page summary in plain English covering: services, fees and costs, standards of conduct, conflicts of interest, and disciplinary information. It includes required \"conversation starter\" questions.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-35",
      "question": "A \"qualified default investment alternative\" (QDIA) in a 401(k) plan is important because:",
      "options": [
        "It eliminates all fiduciary liability for plan sponsors",
        "It protects plan sponsors from fiduciary liability for investing participant contributions that are not directed by the participant, if the QDIA meets DOL requirements (typically a target-date fund, balanced fund, or managed account)",
        "It allows participants to withdraw funds penalty-free",
        "It guarantees participant investment returns"
      ],
      "correct": 1,
      "explanation": "When a participant fails to provide investment direction, plan sponsors must automatically invest contributions. By using a DOL-approved QDIA (target-date fund, balanced fund, or managed account), sponsors receive fiduciary protection under ERISA §404(c)(5). QDIAs replaced the problematic practice of defaulting to money market funds, which underperformed for long-term retirement saving.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-36",
      "question": "The \"risk-free rate\" most commonly used in financial models is:",
      "options": [
        "The prime rate set by major banks",
        "The yield on short-term U.S. Treasury bills — considered essentially default-free and with minimal interest rate risk given short maturity",
        "The Fed funds rate",
        "The LIBOR or SOFR rate"
      ],
      "correct": 1,
      "explanation": "The U.S. T-bill rate is the standard proxy for the risk-free rate in financial models (CAPM, Sharpe ratio, Black-Scholes). U.S. Treasuries are considered free of default risk, and T-bills (short maturity) minimize interest rate risk. In practice, 3-month T-bill yields are most commonly used, though some use 10-year yields for long-term analyses.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-37",
      "question": "The \"marginal cost of capital\" (MCC) is important in capital budgeting because:",
      "options": [
        "It is always fixed regardless of financing amount",
        "It rises as a firm raises more capital — representing the cost of each additional dollar of new financing, which must be compared to the return on investment projects",
        "It only applies to debt financing",
        "It equals the risk-free rate plus inflation"
      ],
      "correct": 1,
      "explanation": "The MCC is the weighted average cost of each additional dollar of new capital raised. As a firm raises more capital, it may exhaust cheaper financing sources, making each additional dollar more expensive. Investment projects should only be undertaken if their expected return exceeds the MCC at that level of financing.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-38",
      "question": "ERISA preempts state laws that \"relate to\" employee benefit plans EXCEPT for:",
      "options": [
        "All state laws without exception",
        "State laws in areas ERISA specifically saves: insurance regulation, banking regulation, and securities regulation — the \"savings clause\" preserves state regulation in these areas",
        "State criminal laws",
        "State contract laws"
      ],
      "correct": 1,
      "explanation": "ERISA's broad preemption (§514) supersedes state laws relating to employee benefit plans. However, the savings clause (§514(b)(2)(A)) preserves state laws that regulate the business of insurance. The deemer clause prevents self-insured plans from being deemed to be in the business of insurance (preventing state mandates from applying to self-insured plans).",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-39",
      "question": "Under IRC §409A, non-qualified deferred compensation arrangements must comply with strict rules on:",
      "options": [
        "How often employees can receive raises",
        "Elections to defer compensation (must be made prior to the year of service), permissible distribution events, and timing of distributions — violations trigger immediate income recognition plus 20% penalty tax",
        "Required minimum distributions",
        "The types of investments allowed in the plan"
      ],
      "correct": 1,
      "explanation": "Section 409A imposed strict rules on non-qualified deferred compensation: (1) deferral elections must be made before the year in which services are performed; (2) distributions can only occur at specified times (separation, death, disability, change in control, etc.); (3) no acceleration of deferred amounts. Violations result in immediate income inclusion plus a 20% excise tax plus interest.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-40",
      "question": "A \"collateralized loan obligation\" (CLO) is:",
      "options": [
        "A simple bank loan",
        "A structured credit product backed by a pool of leveraged loans — with tranches offering different risk/return profiles, managed by a CLO manager",
        "A type of mortgage-backed security",
        "A government-guaranteed student loan pool"
      ],
      "correct": 1,
      "explanation": "CLOs are structured vehicles that pool leveraged corporate loans (typically bank loans to below-investment-grade companies) and issue tranches of notes with different risk/return profiles. Senior tranches (AAA) have priority on cash flows and principal; equity/junior tranches bear losses first but receive residual returns. CLOs are actively managed by CLO managers.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-41",
      "question": "The \"prudent investor rule\" under UPIA differs from the older \"prudent man rule\" in that UPIA:",
      "options": [
        "Restricts trustees to government bonds only",
        "Evaluates investments as part of the TOTAL portfolio rather than in isolation, embraces Modern Portfolio Theory, and removes the categorical prohibition on certain \"speculative\" investments",
        "Requires trustees to outperform the market annually",
        "Applies only to charitable foundations"
      ],
      "correct": 1,
      "explanation": "The old prudent man rule evaluated each investment in isolation — leading trustees to avoid \"speculative\" investments like equities. UPIA (1994) embraced MPT: (1) evaluate investments as part of the total portfolio; (2) assess risk/return tradeoff across the whole portfolio; (3) no investment is categorically imprudent if it fits the overall strategy; (4) consider costs.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-42",
      "question": "Which of the following is a \"prohibited transaction exemption\" (PTE) under ERISA?",
      "options": [
        "PTE 2020-02 — allowing financial institutions to receive compensation for investment advice to retirement investors if best-interest requirements are met",
        "An exemption allowing plan fiduciaries to invest all assets in employer stock",
        "A rule allowing fiduciaries to self-deal without disclosure",
        "An exemption from diversification requirements for single-employer plans"
      ],
      "correct": 0,
      "explanation": "PTE 2020-02 (effective 2021) allows financial institutions (broker-dealers, RIAs, banks, insurance companies) to receive compensation that would otherwise be prohibited (like IRA rollover compensation) if they: acknowledge fiduciary status, act in the retirement investor's best interest, charge only reasonable compensation, and comply with specific impartial conduct standards.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-43",
      "question": "A \"subscription line of credit\" or \"capital call facility\" in private equity allows funds to:",
      "options": [
        "Provide loans to portfolio companies",
        "Borrow short-term against investor commitments to make investments before calling capital from LPs — improving IRR metrics but not economic returns",
        "Allow investors to subscribe to additional fund interests",
        "Finance the fund manager's management fees"
      ],
      "correct": 1,
      "explanation": "PE subscription lines allow funds to borrow against limited partner commitments to make investments without immediately calling capital from LPs. This delays the capital call, making the fund's IRR look better (since the clock starts later). However, the economic return (MOIC - multiple of invested capital) is unchanged. Critics argue this distorts performance metrics.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-44",
      "question": "The \"J-curve\" in private equity refers to:",
      "options": [
        "The relationship between risk and return over time",
        "The tendency for private equity fund returns to be negative in early years (management fees, losses on early investments) before turning positive as portfolio companies mature and are exited",
        "The exponential growth pattern of successful PE investments",
        "The yield curve for high-yield bonds"
      ],
      "correct": 1,
      "explanation": "The PE J-curve shows negative IRR in early fund years due to: management fees being charged on committed capital before investments generate returns, early investments written down before they appreciate, and the absence of exits to realize gains. As the fund matures (years 4-7+), successful exits generate positive returns that curve upward — forming a \"J\" shape on an IRR chart.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-45",
      "question": "Under the USA PATRIOT Act, financial institutions must establish a Customer Identification Program (CIP) that verifies:",
      "options": [
        "Whether customers have prior criminal records",
        "The identity of each customer opening an account — including name, date of birth, address, and identification number (SSN or passport number for non-U.S. persons)",
        "The customer's investment experience and sophistication",
        "Whether the customer is an accredited investor"
      ],
      "correct": 1,
      "explanation": "The USA PATRIOT Act (2001) requires financial institutions to establish CIPs as part of their AML programs. For individuals: name, DOB, address, and identification number (SSN for U.S. persons; passport or other ID for non-U.S. persons). Institutions must verify this information through documentary or non-documentary methods.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-46",
      "question": "The \"beneficial ownership rule\" (FinCEN Rule) requires financial institutions to identify:",
      "options": [
        "The top 10 largest shareholders of public companies",
        "The natural persons (individuals) who own 25%+ of a legal entity customer AND one individual with significant control — for AML purposes",
        "All employees of corporate clients",
        "Only publicly disclosed shareholders"
      ],
      "correct": 1,
      "explanation": "FinCEN's Beneficial Ownership Rule (effective 2018) requires financial institutions to identify and verify: (1) all natural persons owning 25%+ of a legal entity (equity prong); and (2) one person with significant responsibility for controlling or managing the entity (control prong). This combats shell company abuse for money laundering.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-47",
      "question": "The \"two-and-twenty\" fee structure in hedge funds refers to:",
      "options": [
        "2% returns guaranteed plus 20% profit sharing",
        "A 2% annual management fee on AUM plus a 20% performance fee on profits above the high-water mark",
        "20% of AUM charged annually with 2% per trade",
        "A fee structure requiring 2 years of investment before withdrawal"
      ],
      "correct": 1,
      "explanation": "The traditional hedge fund fee structure: (1) 2% annual management fee charged on total AUM regardless of performance — covers operational costs; (2) 20% incentive fee (carried interest) charged on profits above the high-water mark. The high-water mark ensures managers only earn performance fees on new profits after recovering previous losses. This structure has compressed considerably in recent years.",
      "points": 25
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-48",
      "question": "SOFR (Secured Overnight Financing Rate) replaced LIBOR because:",
      "options": [
        "SOFR is set by the Federal Reserve, not banks",
        "SOFR is based on actual overnight Treasury repo transactions — making it nearly impossible to manipulate, unlike LIBOR which was based on bank submissions that could be (and were) manipulated",
        "SOFR provides higher yields for investors",
        "SOFR better reflects unsecured credit risk between banks"
      ],
      "correct": 1,
      "explanation": "LIBOR was based on submissions by a panel of banks estimating their borrowing costs — a system proven to be manipulated (LIBOR scandal, 2012). SOFR is based on actual overnight repo transactions using Treasuries as collateral — a massive, transaction-based market exceeding $1 trillion daily. Its transaction basis makes it manipulation-resistant. SOFR replaced LIBOR as the standard reference rate in 2023.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-49",
      "question": "A \"defeasance\" in fixed income occurs when:",
      "options": [
        "A bond is called at par by the issuer",
        "An issuer creates a separate trust holding Treasury securities whose cash flows exactly match future bond payments — effectively retiring the economic obligation without legally retiring the debt",
        "The bondholder sells the bond in the secondary market",
        "A bond is converted to equity by the issuer"
      ],
      "correct": 1,
      "explanation": "Defeasance (particularly \"in-substance defeasance\") allows an issuer to remove debt from its balance sheet by placing Treasury securities (or government-backed securities) in a trust with cash flows matched to the outstanding bond's payment schedule. The debt is economically but not legally retired — it remains outstanding but is fully offset by the trust assets.",
      "points": 30
    },
    {
      "exam": "Series 66",
      "domain": "Legacy Foundation",
      "difficulty": "senior",
      "cooldown": 28,
      "topicTag": "legacy-expert-50",
      "question": "The concept of \"portable alpha\" in institutional investing involves:",
      "options": [
        "Moving an investor's portfolio between managers frequently",
        "Separating alpha (manager skill) from beta (market exposure) — using derivatives to maintain benchmark beta while adding alpha from a separate active strategy",
        "Carrying losses forward to offset future gains",
        "Transferring investment strategies across client accounts"
      ],
      "correct": 1,
      "explanation": "Portable alpha separates the two return components: (1) beta — market/index exposure, obtained cheaply via derivatives (futures, swaps); and (2) alpha — manager skill, sought in a separate, uncorrelated active strategy (hedge fund, market-neutral strategy). This allows investors to maintain strategic market exposure while accessing alpha from any strategy regardless of asset class.",
      "points": 30
    }
  ]
} satisfies Record<string, Question[]>;

export const CLIENT_QUESTION_SETS = {
  "retiree": [
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "retiree-1",
      "question": "Should I move everything into stocks for higher returns?",
      "options": [
        "Yes, maximize returns",
        "No, income-focused allocation is appropriate",
        "Only tech stocks",
        "Yes but only 50%"
      ],
      "correct": 1,
      "explanation": "At 68 with conservative risk tolerance, heavy equity exposure is unsuitable. A balanced income-focused allocation protects against sequence-of-returns risk.",
      "points": 15
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "retiree-2",
      "question": "How will selling my bond fund affect my taxes this year?",
      "options": [
        "No tax impact",
        "Capital gains tax applies based on holding period",
        "Only ordinary income tax",
        "Tax-free if reinvested"
      ],
      "correct": 1,
      "explanation": "Bond fund sales trigger capital gains events. If held over 1 year, long-term rates apply (0%, 15%, or 20% based on income).",
      "points": 20
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "retiree-3",
      "question": "My neighbor says I should put it all in gold. Good idea?",
      "options": [
        "Yes, gold is safest",
        "No — gold is a hedge, 5-10% max allocation",
        "Yes, inflation is coming",
        "Only if the dollar falls"
      ],
      "correct": 1,
      "explanation": "Gold is an inflation hedge, not an income generator. A 5-10% allocation may be appropriate but 100% concentration violates diversification principles.",
      "points": 15
    }
  ],
  "young_pro": [
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "young_pro-1",
      "question": "Should I use margin to buy more tech stocks?",
      "options": [
        "Never use margin",
        "Moderate margin is acceptable given your risk profile",
        "Max out margin immediately",
        "Only for blue chips"
      ],
      "correct": 1,
      "explanation": "With aggressive tolerance and a 30+ year horizon, moderate margin use is acceptable but requires disclosure and defined limits.",
      "points": 15
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "young_pro-2",
      "question": "I want to buy call options on AAPL before earnings — suitable?",
      "options": [
        "No, options are never suitable",
        "Yes, with full risk disclosure",
        "Only puts, not calls",
        "Only if you own the stock"
      ],
      "correct": 1,
      "explanation": "Speculative options are suitable for aggressive risk profiles. Full disclosure of maximum loss potential (premium paid) is required.",
      "points": 20
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "young_pro-3",
      "question": "Should I max my 401k or invest in a taxable account first?",
      "options": [
        "Taxable account first",
        "Max 401k first for tax advantage",
        "Split 50/50",
        "Neither — pay down debt first always"
      ],
      "correct": 1,
      "explanation": "Tax-advantaged accounts (401k, IRA) should be maximized before taxable investing for long-term wealth accumulation, barring high-interest debt.",
      "points": 15
    }
  ],
  "family": [
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "family-1",
      "question": "Should we pay off the mortgage or invest more?",
      "options": [
        "Always pay mortgage first",
        "Compare mortgage rate to expected investment returns",
        "Always invest — never prepay",
        "Pay mortgage if rate above 5%"
      ],
      "correct": 3,
      "explanation": "If the mortgage rate exceeds expected risk-adjusted returns, paydown may be preferable. With rates above 5-6%, this calculation changes significantly.",
      "points": 20
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "family-2",
      "question": "What account should we use for the college fund?",
      "options": [
        "UGMA/UTMA",
        "529 Plan",
        "Roth IRA",
        "Standard brokerage"
      ],
      "correct": 1,
      "explanation": "529 plans offer tax-advantaged growth for education expenses, state deductions, and are the standard vehicle for college funding.",
      "points": 15
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "family-3",
      "question": "Our 12-year-old's fund is in aggressive stocks — should we rebalance?",
      "options": [
        "No, more time to recover",
        "Yes, shift toward moderate allocation",
        "Move 100% to cash now",
        "Only rebalance when market drops"
      ],
      "correct": 1,
      "explanation": "With college 6 years away, reducing equity risk is prudent — the time horizon is shortening and sequence risk becomes more important.",
      "points": 20
    }
  ],
  "entrepreneur": [
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "entrepreneur-1",
      "question": "I received $1.2M from my business sale — tax implications?",
      "options": [
        "No tax — it's your money",
        "Depends on asset vs stock sale structure — capital gains may apply",
        "Flat 15% regardless",
        "Tax-free if reinvested within 60 days"
      ],
      "correct": 1,
      "explanation": "Business sale taxation is complex. Asset sales vs stock sales are taxed differently. Long-term capital gains up to 20% plus NIIT and state taxes may apply.",
      "points": 25
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "entrepreneur-2",
      "question": "All at once or dollar-cost average the $1.2M into markets?",
      "options": [
        "Always DCA, never lump sum",
        "Lump sum statistically outperforms; DCA reduces timing regret",
        "Hold it all in cash",
        "Half now, half in 5 years"
      ],
      "correct": 1,
      "explanation": "Research shows lump sum investing outperforms DCA ~66% of the time, but DCA reduces timing risk psychologically and is appropriate for large sums.",
      "points": 20
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "entrepreneur-3",
      "question": "Can a Roth conversion reduce my future tax burden?",
      "options": [
        "No — Roth is only for young people",
        "Yes, if done strategically during lower-income years",
        "Only if under age 50",
        "Conversions are taxable and never worthwhile"
      ],
      "correct": 1,
      "explanation": "Post-exit years may have lower income, making Roth conversions tax-efficient. Requires careful bracket analysis to avoid pushing into higher rates.",
      "points": 20
    }
  ],
  "institutional": [
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "institutional-1",
      "question": "The endowment must distribute 5% annually. Markets dropped 20%. What is the primary concern?",
      "options": [
        "Ignore the spending rule",
        "Sequence of returns risk — distributing 5% from a depleted portfolio locks in losses and threatens corpus",
        "Increase equity allocation immediately",
        "Suspend all distributions"
      ],
      "correct": 1,
      "explanation": "Endowments following a 5% spending rule face acute sequence risk during downturns. Spending from a 20%-reduced corpus accelerates depletion. Smoothing rules (3-year rolling average) are common mitigation strategies under UPIA.",
      "points": 35
    },
    {
      "exam": "Client",
      "domain": "Client Suitability",
      "difficulty": "client",
      "cooldown": 12,
      "topicTag": "institutional-2",
      "question": "The board wants to invest 30% in hedge funds. What is your primary fiduciary obligation?",
      "options": [
        "Decline — hedge funds are prohibited",
        "Analyze whether the allocation meets UPIA standards: appropriate risk/return, diversification, and cost relative to expected benefit",
        "Approve immediately — diversification is always good",
        "Require SEC approval first"
      ],
      "correct": 1,
      "explanation": "UPIA allows alternative investments if they fit the overall portfolio strategy. The trustee must evaluate risk-adjusted returns, fees (management + performance), liquidity, and lock-up periods. Approval requires documented prudent analysis, not blanket acceptance or rejection.",
      "points": 35
    }
  ]
} satisfies Record<string, Question[]>;

export const AUDIT_QUESTIONS = [
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-1",
    "question": "The SEC is reviewing this equity purchase for a conservative retiree client. Which justification best satisfies your fiduciary duty?",
    "options": [
      "The stock was trending up and I wanted to capture momentum",
      "The purchase fits the client's income objective, represents <5% of portfolio, and aligns with their documented risk tolerance",
      "Another client in a similar account holds this position",
      "The commission on this trade was favorable for the firm"
    ],
    "correct": 1,
    "explanation": "A fiduciary must be able to justify every trade in terms of the specific client's documented investment profile. Momentum, peer comparison, and firm profitability are NOT valid justifications under Reg BI or the fiduciary standard.",
    "points": 75
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-2",
    "question": "The SEC examiner asks why you liquidated this position for an aggressive growth client. Which answer demonstrates proper fiduciary reasoning?",
    "options": [
      "The stock dropped and I panicked on behalf of the client",
      "The client needed liquidity and this position had appreciated, making it the most tax-efficient sale given their bracket",
      "I always sell when a position is down 10%",
      "The firm was reducing its proprietary exposure to this sector"
    ],
    "correct": 1,
    "explanation": "Fiduciary decisions must be based on the CLIENT's situation — liquidity needs, tax efficiency, and documented goals. Panic reactions, arbitrary rules, and firm interests are not valid fiduciary justifications.",
    "points": 75
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-3",
    "question": "An examiner questions why you executed an options strategy for this client. What is the most defensible fiduciary justification?",
    "options": [
      "Options always outperform stocks, so it benefits any client",
      "The client requested speculative positions; options were disclosed as high-risk; the position size was appropriate for their aggressive profile",
      "I needed to generate commissions to meet my monthly quota",
      "Options are suitable for all accounts above $50,000"
    ],
    "correct": 1,
    "explanation": "Options are only suitable when: the client profile supports it (risk tolerance, experience, financial capacity); full risk disclosure was made; and the position size is proportionate. Broad suitability claims and commission motivations violate Reg BI.",
    "points": 80
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-4",
    "question": "The SEC is reviewing a purchase of a high-yield bond for a moderate-risk client. How do you defend this recommendation?",
    "options": [
      "High-yield bonds always provide better income than investment-grade bonds",
      "The position represents 3% of the portfolio, the client's income objective was documented, and the yield premium compensated appropriately for the credit risk given their time horizon",
      "The bond was recommended by a well-known analyst on TV",
      "The client verbally agreed to anything I suggested"
    ],
    "correct": 1,
    "explanation": "High-yield bonds carry significant credit risk. A fiduciary must document: position sizing (proportionate), the specific client objective served, and the risk/return analysis performed. Third-party tips and verbal consent are not adequate fiduciary documentation.",
    "points": 75
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-5",
    "question": "The examiner asks why you sold a position immediately before a market event, raising front-running concerns. What's your defense?",
    "options": [
      "I had non-public information that the event would be negative",
      "The sell was based solely on the client's documented rebalancing plan established before the event; no material non-public information was used",
      "I always liquidate before major announcements as a precaution",
      "The client gave me permission to trade on any information available"
    ],
    "correct": 1,
    "explanation": "Front-running and insider trading are among the most serious violations. The only valid defense is a documented, pre-existing plan (like a 10b5-1 plan or rebalancing policy) that was established without knowledge of the specific event. Blanket \"precaution\" policies and client consent do not override securities law.",
    "points": 90
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-6",
    "question": "You bought the same stock for 12 different clients on the same day. The SEC is examining potential \"scalping.\" How do you justify this?",
    "options": [
      "I own this stock personally and believe in it strongly",
      "The purchase was consistent with each client's documented investment policy statement; allocations were made pro-rata and no personal positions were traded around client orders",
      "Buying for multiple clients proves the recommendation was good",
      "I disclosed my personal position in a general newsletter"
    ],
    "correct": 1,
    "explanation": "Scalping (buying for clients to drive up a price, then selling personal positions) is fraud under SEC Rule 10b-5. The defense requires: client-specific suitability documentation, fair allocation procedures (pro-rata or rotation), and no personal trading that could constitute front-running or scalping.",
    "points": 85
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-7",
    "question": "The auditor notes you recommended a proprietary fund over a lower-cost third-party alternative. How do you satisfy your conflict-of-interest disclosure obligation?",
    "options": [
      "Proprietary funds always perform better, so no disclosure is needed",
      "The conflict was disclosed in writing on Form CRS and ADV; the fund's net performance and cost were compared favorably to alternatives; the recommendation was in the client's best interest",
      "I mentioned it verbally once during the account opening meeting",
      "FINRA allows proprietary recommendations without disclosure"
    ],
    "correct": 1,
    "explanation": "Recommending proprietary products is a material conflict of interest requiring full written disclosure under Reg BI and the Advisers Act. Form CRS must disclose the conflict. The recommendation must STILL be in the client's best interest — disclosure alone does not cure an unsuitable recommendation.",
    "points": 80
  },
  {
    "exam": "Audit",
    "domain": "Fiduciary Audit",
    "difficulty": "audit",
    "cooldown": 6,
    "topicTag": "audit-8",
    "question": "An examiner questions a series of frequent trades generating high commissions. What distinguishes active management from churning?",
    "options": [
      "The number of trades — more than 5 per month is always churning",
      "Whether the trading frequency was consistent with the client's documented objectives and investment policy, not driven primarily by commission generation",
      "The size of commissions — small commissions are always acceptable",
      "Churning only applies to discretionary accounts"
    ],
    "correct": 1,
    "explanation": "Churning is defined by INTENT and EXCESS relative to the client's profile — not an absolute number of trades. The \"annualized turnover ratio\" and \"cost-equity ratio\" are used to assess whether trading was excessive. The key test: was this trading in the CLIENT's interest or the ADVISOR's? Churning applies to both discretionary and non-discretionary accounts.",
    "points": 80
  }
] satisfies Question[];

export const QUESTION_COOLDOWNS = {
  learner: 72,
  trainee: 62,
  associate: 45,
  advisor: 30,
  senior: 28,
  audit: 6,
  client: 12
} as const;

const WRAPPERS = [
  "On a licensing exam, ",
  "A candidate is asked: ",
  "During a practice question, ",
  "A client scenario asks, ",
  "In a regulatory review, ",
  "For exam prep, ",
  "A study prompt states, ",
  "A knowledge check asks, ",
  "An exam scenario says, ",
  "A review question asks, "
];

function wrapQuestion(question: Question, variant: number): Question {
  const prefix = WRAPPERS[variant % WRAPPERS.length];

  return {
    ...question,
    topicTag: `${question.topicTag}-variant-${variant + 1}`,
    question: `${prefix}${question.question.charAt(0).toLowerCase()}${question.question.slice(1)}`
  };
}

function inflatePool(base: Question[], generated: Question[], target: number): Question[] {
  const pool = [...base];

  if (pool.length >= target) {
    return pool.slice(0, target);
  }

  let variant = 0;
  while (pool.length < target) {
    const source = generated[variant % generated.length];
    pool.push(wrapQuestion(source, variant));
    variant += 1;
  }

  return pool;
}

function makeQuestion(question: Question): Question {
  return question;
}

const SIE_GENERATED: Question[] = [
  makeQuestion({
    exam: "SIE",
    domain: "Knowledge of Capital Markets",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-primary-market",
    question: "Which market handles the sale of newly issued securities in which the issuer receives the proceeds?",
    options: ["Primary market", "Secondary market", "OTC aftermarket", "Auction facility"],
    correct: 0,
    explanation: "The primary market is where issuers sell new securities and receive capital. The secondary market is where investors trade outstanding securities with each other after issuance.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Knowledge of Capital Markets",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-rate-impact",
    question: "When interest rates rise, what generally happens to outstanding bond prices?",
    options: ["They generally rise", "They generally fall", "They are unchanged", "They become tax-free"],
    correct: 1,
    explanation: "Bond prices and interest rates usually move in opposite directions. When market rates rise, older bonds with lower coupons become less attractive and their prices usually fall.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Understanding Products and Their Risks",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-common-stock",
    question: "Which feature is typically associated with common stock?",
    options: ["Voting rights and residual ownership", "A fixed maturity date", "Guaranteed dividends", "Priority over secured creditors"],
    correct: 0,
    explanation: "Common stock represents an ownership interest in a corporation and often includes voting rights. Common shareholders are residual owners, so they are paid after creditors and preferred shareholders in liquidation.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Understanding Trading, Customer Accounts and Prohibited Activities",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-stop-order",
    question: "Which order becomes a market order once the stop price is reached?",
    options: ["Stop order", "Limit order", "Fill-or-kill order", "Market-on-close order"],
    correct: 0,
    explanation: "A stop order activates once the stop price is reached and then becomes a market order. That means the execution price can differ from the trigger price depending on market conditions.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Overview of Regulatory Framework",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-finra",
    question: "Which organization is the primary self-regulatory organization for broker-dealers in the United States?",
    options: ["FINRA", "IRS", "Treasury Department", "Federal Reserve Board"],
    correct: 0,
    explanation: "FINRA is the primary self-regulatory organization that oversees broker-dealers and their registered representatives. It operates under SEC oversight but is not itself a federal agency.",
    points: 10
  })
];

function buildSeries7QuestionSet(): Question[] {
  const symbols = ["ABC", "XYZ", "QRS", "LMN", "TUV", "MNO", "RST", "JKL", "PQR", "DEF"];
  const generated: Question[] = [];

  symbols.forEach((symbol, index) => {
    const strike = 45 + index * 5;
    const premium = 2 + (index % 4);
    const width = 5;
    const stockCost = strike - 4;
    const stockPrice = strike + premium + 6;

    generated.push(
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-long-call-${symbol}`,
        question: `An investor buys 1 ${symbol} ${strike} call for a premium of ${premium}. What is the breakeven at expiration?`,
        options: [`${strike - premium}`, `${strike}`, `${strike + premium}`, `${strike + premium + 5}`],
        correct: 2,
        explanation: "A long call's breakeven is the strike price plus the premium paid. The option becomes profitable only if the stock rises above that combined amount by expiration.",
        points: 15
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-long-put-${symbol}`,
        question: `An investor buys 1 ${symbol} ${strike} put for a premium of ${premium}. What is the breakeven at expiration?`,
        options: [`${strike + premium}`, `${strike}`, `${strike - premium}`, `${strike - premium - 5}`],
        correct: 2,
        explanation: "A long put's breakeven is the strike price minus the premium paid. The position profits when the market price falls below that level by expiration.",
        points: 15
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-covered-call-${symbol}`,
        question: `A customer owns ${symbol} stock at ${stockCost} and writes a covered ${strike} call for a premium of ${premium}. What is the maximum gain per share if assigned?`,
        options: [`${premium}`, `${strike - stockCost + premium}`, `${strike + premium}`, `${stockCost}`],
        correct: 1,
        explanation: "The maximum gain on a covered call equals the appreciation from the stock cost basis to the strike price, plus the premium received. Upside is capped because the shares may be called away at the strike price.",
        points: 15
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-protective-put-${symbol}`,
        question: `A customer buys ${symbol} stock at ${strike + 3} and a protective ${strike} put for ${premium}. What is the maximum loss per share?`,
        options: [`${premium}`, `${strike + 3 - strike + premium}`, `${strike + premium}`, `${strike + 3 + premium}`],
        correct: 1,
        explanation: "The maximum loss on a protective put equals the stock purchase price minus the put strike price, plus the premium paid for the put. The put creates a floor that limits downside exposure.",
        points: 15
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-bull-call-spread-${symbol}`,
        question: `An investor buys the ${strike} call and sells the ${strike + width} call on ${symbol} for a net debit of ${premium}. What is the maximum gain per share?`,
        options: [`${premium}`, `${width - premium}`, `${width + premium}`, `${strike + width}`],
        correct: 1,
        explanation: "The maximum gain on a bull call spread equals the difference between the strike prices minus the net debit paid. The short call caps the upside while reducing the cost of the long call.",
        points: 20
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-bear-put-spread-${symbol}`,
        question: `An investor buys the ${strike + width} put and sells the ${strike} put on ${symbol} for a net debit of ${premium}. What is the maximum gain per share?`,
        options: [`${width - premium}`, `${premium}`, `${width + premium}`, `${strike + width}`],
        correct: 0,
        explanation: "The maximum gain on a bear put spread equals the difference between the strike prices minus the net debit paid. The lower-strike short put limits the upside while offsetting some of the premium cost.",
        points: 20
      }),
      makeQuestion({
        exam: "Series 7",
        domain: "Options Strategies",
        difficulty: "associate",
        cooldown: QUESTION_COOLDOWNS.associate,
        topicTag: `series7-intrinsic-call-${symbol}`,
        question: `A customer buys 1 ${symbol} ${strike} call for ${premium}. If the stock is ${stockPrice} at expiration, what is the intrinsic value per share?`,
        options: [`${premium}`, `${stockPrice - strike}`, `${stockPrice - strike - premium}`, `${strike - stockPrice}`],
        correct: 1,
        explanation: "Intrinsic value for a call is the amount by which the market price exceeds the strike price when the option is in the money. Premium affects net profit, but not the intrinsic value calculation itself.",
        points: 15
      })
    );
  });

  generated.push(
    makeQuestion({
      exam: "Series 7",
      domain: "Debt Securities",
      difficulty: "associate",
      cooldown: QUESTION_COOLDOWNS.associate,
      topicTag: "series7-bond-prices",
      question: "When prevailing market rates fall, what generally happens to the price of an outstanding bond with a fixed coupon?",
      options: ["The price generally rises", "The price generally falls", "The bond becomes callable", "The bond loses accrued interest"],
      correct: 0,
      explanation: "Bond prices and rates usually move in opposite directions. A fixed-coupon bond becomes more attractive when new issues offer lower yields, so its market price usually rises.",
      points: 15
    }),
    makeQuestion({
      exam: "Series 7",
      domain: "Municipal Securities",
      difficulty: "associate",
      cooldown: QUESTION_COOLDOWNS.associate,
      topicTag: "series7-go-bonds",
      question: "Which municipal bond is generally backed by the issuer's full faith and credit and taxing power?",
      options: ["General obligation bond", "Revenue bond", "Equipment trust certificate", "Commercial paper"],
      correct: 0,
      explanation: "General obligation bonds are generally supported by the issuer's taxing power and full faith and credit. Revenue bonds depend primarily on the revenues of the financed project or facility.",
      points: 15
    }),
    makeQuestion({
      exam: "Series 7",
      domain: "Direct Participation Programs and Variable Products",
      difficulty: "associate",
      cooldown: QUESTION_COOLDOWNS.associate,
      topicTag: "series7-dpp-risk",
      question: "Which risk is especially important when evaluating a direct participation program for a retail customer?",
      options: ["Liquidity risk", "Guaranteed NAV fluctuations", "Daily redemption pressure", "FDIC insurance risk"],
      correct: 0,
      explanation: "Direct participation programs often have limited secondary markets and long holding periods, so liquidity risk is a major suitability issue. Customers who may need quick access to funds often are not good candidates for illiquid programs.",
      points: 15
    }),
    makeQuestion({
      exam: "Series 7",
      domain: "Margin and Customer Accounts",
      difficulty: "associate",
      cooldown: QUESTION_COOLDOWNS.associate,
      topicTag: "series7-regt",
      question: "Under Regulation T, what is the standard initial margin requirement for most equity purchases in a margin account?",
      options: ["25%", "40%", "50%", "75%"],
      correct: 2,
      explanation: "Regulation T sets the standard initial equity requirement for most margin stock purchases at 50% of the purchase price. Maintenance margin is a separate, ongoing requirement and is usually lower.",
      points: 15
    })
  );

  return generated;
}

const SERIES65_GENERATED: Question[] = [
  makeQuestion({
    exam: "Series 65",
    domain: "Laws, Regulations, and Guidelines",
    difficulty: "advisor",
    cooldown: QUESTION_COOLDOWNS.advisor,
    topicTag: "series65-loyalty",
    question: "An adviser recommends the product that pays the highest compensation without disclosing the conflict, even though a lower-cost alternative better fits the client. Which fiduciary principle is most directly implicated?",
    options: ["Duty of loyalty", "Custody exemption", "Surety bond requirement", "Blue-sky registration by qualification"],
    correct: 0,
    explanation: "The fiduciary duty of loyalty requires an adviser to place the client's interests first and to disclose material conflicts fully and fairly. Steering the client toward a more lucrative product without disclosure puts the adviser's interest ahead of the client's.",
    points: 25
  }),
  makeQuestion({
    exam: "Series 65",
    domain: "Laws, Regulations, and Guidelines",
    difficulty: "advisor",
    cooldown: QUESTION_COOLDOWNS.advisor,
    topicTag: "series65-advisers-act",
    question: "Which federal statute is the primary source of law governing federally registered investment advisers?",
    options: ["Securities Act of 1933", "Investment Advisers Act of 1940", "Securities Exchange Act of 1934", "Trust Indenture Act of 1939"],
    correct: 1,
    explanation: "The Investment Advisers Act of 1940 is the core federal statute regulating investment advisers. It establishes registration, anti-fraud, custody, recordkeeping, and fiduciary standards for advisers subject to federal oversight.",
    points: 25
  }),
  makeQuestion({
    exam: "Series 65",
    domain: "Client Investment Recommendations and Strategies",
    difficulty: "advisor",
    cooldown: QUESTION_COOLDOWNS.advisor,
    topicTag: "series65-mpt",
    question: "Under modern portfolio theory, why can diversification improve a portfolio's risk-adjusted profile?",
    options: ["Because combining imperfectly correlated assets can reduce unsystematic risk", "Because diversification eliminates all market risk", "Because diversification guarantees positive annual returns", "Because diversification converts stocks into fixed-income securities"],
    correct: 0,
    explanation: "Modern portfolio theory teaches that combining assets with imperfect correlations can reduce unsystematic risk. Diversification does not eliminate systematic market risk, but it can improve the overall tradeoff between expected risk and expected return.",
    points: 20
  }),
  makeQuestion({
    exam: "Series 65",
    domain: "Client Investment Recommendations and Strategies",
    difficulty: "advisor",
    cooldown: QUESTION_COOLDOWNS.advisor,
    topicTag: "series65-asset-location",
    question: "When suitable and available, tax-inefficient assets that generate substantial ordinary income are often best located where?",
    options: ["In tax-advantaged accounts", "Only in margin accounts", "Only in taxable joint accounts", "In a custodial account regardless of the client"],
    correct: 0,
    explanation: "Asset location often places tax-inefficient holdings inside tax-advantaged accounts to reduce current tax drag. The strategy still must fit the client's goals, liquidity needs, and account constraints.",
    points: 20
  }),
  makeQuestion({
    exam: "Series 65",
    domain: "Client Investment Recommendations and Strategies",
    difficulty: "advisor",
    cooldown: QUESTION_COOLDOWNS.advisor,
    topicTag: "series65-erisa",
    question: "Under ERISA, what broad standard applies to plan fiduciaries managing retirement plan assets?",
    options: ["They must act solely in the interest of participants and beneficiaries with prudence", "They must maximize employer stock concentration", "They may follow employer preference over participant need", "They are exempt from diversification concerns"],
    correct: 0,
    explanation: "ERISA fiduciaries must act solely in the interest of plan participants and beneficiaries and with the care, skill, prudence, and diligence of a prudent expert. That standard drives plan governance, investment selection, and ongoing oversight.",
    points: 25
  })
];

const SERIES66_GENERATED: Question[] = [
  makeQuestion({
    exam: "Series 66",
    domain: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices",
    difficulty: "senior",
    cooldown: QUESTION_COOLDOWNS.senior,
    topicTag: "series66-agent-registration",
    question: "Under state securities law, when is an agent of a broker-dealer generally required to register in a state?",
    options: ["When transacting securities business in that state unless an exemption applies", "Only when the SEC orders it", "Only after ten trades", "Only if the customer is institutional"],
    correct: 0,
    explanation: "Agents generally must register in a state before transacting securities business there unless a specific exemption or exclusion applies. Federal status alone does not replace the state's authority over agent registration.",
    points: 25
  }),
  makeQuestion({
    exam: "Series 66",
    domain: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices",
    difficulty: "senior",
    cooldown: QUESTION_COOLDOWNS.senior,
    topicTag: "series66-bd-registration",
    question: "A broker-dealer with no office in a state actively solicits retail residents there. What is the usual registration implication under the Uniform Securities Act framework?",
    options: ["State registration is generally required unless an exemption applies", "No registration is required without a branch office", "Only the agent must register, not the firm", "Registration is optional if trades settle electronically"],
    correct: 0,
    explanation: "A broker-dealer can be required to register in a state even without a physical office there if it transacts business with residents and no exemption applies. State jurisdiction commonly follows business activity, not just office location.",
    points: 25
  }),
  makeQuestion({
    exam: "Series 66",
    domain: "Client/Customer Investment Recommendations and Strategies",
    difficulty: "senior",
    cooldown: QUESTION_COOLDOWNS.senior,
    topicTag: "series66-customer-profile",
    question: "Which customer-profile factors are most central to analyzing whether a recommendation fits the customer?",
    options: ["Objectives, risk tolerance, financial circumstances, liquidity needs, and time horizon", "Political views and media preferences", "Only age and marital status", "Only the customer's current ticker symbols"],
    correct: 0,
    explanation: "Recommendation analysis depends on the customer's investment objectives, risk tolerance, financial condition, liquidity needs, and time horizon. Those factors are core to determining whether a product or strategy is appropriate.",
    points: 20
  }),
  makeQuestion({
    exam: "Series 66",
    domain: "Economic Factors and Business Information",
    difficulty: "senior",
    cooldown: QUESTION_COOLDOWNS.senior,
    topicTag: "series66-business-cycle",
    question: "Which phase of the business cycle is generally associated with rising output, improving employment, and expanding corporate activity after a recession?",
    options: ["Expansion", "Contraction", "Panic liquidation", "Administrative enforcement"],
    correct: 0,
    explanation: "Expansion is the phase of the business cycle marked by increasing production, improving employment, and broad economic growth. It usually follows recessionary contraction and continues until the economy approaches a peak.",
    points: 15
  }),
  makeQuestion({
    exam: "Series 66",
    domain: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices",
    difficulty: "senior",
    cooldown: QUESTION_COOLDOWNS.senior,
    topicTag: "series66-unethical-practice",
    question: "Borrowing money from a customer without meeting a valid exception under firm policy and state rules is most likely treated as what?",
    options: ["An unethical business practice", "A normal administrative shortcut", "A de minimis recordkeeping issue", "A federal covered adviser exclusion"],
    correct: 0,
    explanation: "Borrowing from customers is heavily restricted and often treated as an unethical business practice unless a narrow exception applies and the firm permits it. The restriction exists because personal borrowing can create severe conflicts of interest and abuse risk.",
    points: 25
  })
];

export const QUESTION_POOLS = {
  sie: inflatePool(LEGACY_QUESTION_POOLS.basic, SIE_GENERATED, 300),
  series7: inflatePool(LEGACY_QUESTION_POOLS.intermediate, buildSeries7QuestionSet(), 500),
  series65: inflatePool(LEGACY_QUESTION_POOLS.advanced, SERIES65_GENERATED, 400),
  series66: inflatePool(LEGACY_QUESTION_POOLS.expert, SERIES66_GENERATED, 400)
} as const;

export const DIFFICULTY_TO_POOL_KEY = {
  learner: "sie",
  trainee: "sie",
  associate: "series7",
  advisor: "series65",
  senior: "series66"
} as const;

export function getQuestionsForDifficulty(difficulty: "learner" | "trainee" | "associate" | "advisor" | "senior"): Question[] {
  return QUESTION_POOLS[DIFFICULTY_TO_POOL_KEY[difficulty]];
}
