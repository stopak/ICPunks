import { Principal } from "@dfinity/principal";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, useAuth } from "./auth";
import { Listing_2, TokenDesc } from "./canister/icpunks_type";
import { getCanisterIds } from "./canister/principals";


export interface StateContext {
    userTokens: BigInt[] | null

    displayToken: BigInt | null;
    displayTokenData: TokenDesc | null;
    displayTokenListing: Listing_2 | undefined;
    sortingOrder: boolean;

    listed: Listing_2[] | null;
    listed_page: number | null;
    listed_count: BigInt | null;

    showSendModal: boolean;
    showListModal: boolean;
    showPurchaseModal: boolean;
    showTransferModal: boolean;

    // getRemainingTokens: () => void;
    // claimToken: () => Promise<void>;
    loadUserTokens: () => Promise<void>;
    loadDisplayToken: () => Promise<void>;
    loadListedPage: () => Promise<void>;
    listToken: (tokenId: bigint, price: bigint) => Promise<boolean>;

    delistToken: (BigInt) => Promise<boolean>;
    sendToken: (tokenId: bigint, to: Principal) => Promise<boolean>;
    purchaseToken: (tokenId: bigint) => Promise<boolean>;

    setPage: (number) => void;
    setDisplayedToken: (BigInt) => void;
    setSortingOrder: (asc: boolean) => void;

    setShowSend: (show) => void;
    setShowList: (show) => void;
    setShowPurchase: (show) => void;
    setShowTransfer: (show) => void;

    addListed: (listing) => void;
    removeListed: (token_id) => void;
    setDisplayTokenListing: (listing) => void;
    // purchase: (BigInt) => Promise<boolean>;
    // coinfirmPurchase: (BigInt) => Promise<boolean>;
}

export function useProvideState(): StateContext {
    const authContext = useAuth();

    // const [remainingTokens, setRemainingTokens] = useState<BigInt | null>(null);

    const [userTokens, setUserTokens] = useState<BigInt[] | null>(null);
    const [displayToken, setDisplayToken] = useState<BigInt | null>(null);
    const [displayTokenData, setDisplayTokenData] = useState<TokenDesc | null>(null);
    const [displayTokenListing, setDisplayTokenListing] = useState<Listing_2 | undefined>(undefined);
    const [sortingOrder, setSortingOrder2] = useState(true);

    const [isLoading, setLoading] = useState(false);

    // const [claimDate, setClaimDate] = useState(Date.UTC(2021,8,1,20));
    // const [canClaim, setCanClaim] = useState(false);

    const [listed, setListed] = useState<Listing_2[] | null>(null);
    const [listed_page, setListedPage] = useState<number | null>(null);
    const [listed_count, setListedCount] = useState<BigInt | null>(null);

    const [showSendModal, setShowSendModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    
    
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState({account: null, tx: null, confirmation: null});

    const listToken = async function (tokenId: bigint, price: bigint): Promise<boolean> {
        if (auth.icpunk === undefined) return false;
        let res = await auth.icpunk?.list(tokenId, price);

        if (res === undefined) return false;

        return true;
    }

    const delistToken = async function (tokenId: bigint): Promise<boolean> {
        if (auth.icpunk === undefined) return false;
        let res = await auth.icpunk?.delist(tokenId);

        if (res === undefined) return false;

        return true;
    }

    const sendToken = async function (tokenId: bigint, to: Principal): Promise<boolean> {
        if (auth.icpunk === undefined) return false;
        let res = await auth.icpunk?.transfer_to(to, tokenId);

        if (res === undefined) return false;

        return res;
    }

    const purchaseToken = async function (tokenId: bigint): Promise<boolean> {
        if (auth.icpunk === undefined) return false;
        if (listed === null) return false;

        let listing = listed.find((x) => x.token_id === tokenId);
        if (listing === undefined) return false;

        setShowPurchaseModal(true);

        let prin = getCanisterIds();

        var request = new Request(prin.collect_url + '?from=' + authContext.principal?.toString() + '&amount=' + listing.price + '&token_id=' + tokenId.toString());

        try {
            let resp = await fetch(request);

            if (resp.status !== 200) {
                return false;
            }

            let account = await resp.text();

            // fetch(request).then(function(response) {
            //     // console.log(response);
            // });

            // let to = getCanisterIds().icpunks_wallet;

            let txRequest = {
                to: account,
                amount: Number(listing.price),
                args: {
                    memo: 12345
                },
                memo: 54321
            }

            let result = await auth.wallet?.requestTransfer(txRequest);
            console.log(result);

            setShowPurchaseModal(false);
        } catch (e) {
            console.log(e.message);
        }

        return false;
    }

    const setSortingOrder = function (asc: boolean): void {
        // if (sortingOrder == asc) return;
        if (listed === null) return;

        let items: Listing_2[] = [...listed];

        items = items.sort((a, b) => (a.price > b.price ? 1 : -1));

        if (!asc) {
            items.reverse();
        }

        // for (var i=0;i<listed.length;i++) {
        //     items.push(listed[listed.length-1-i]);
        // }

        setListed(items);

        setSortingOrder2(asc);
    }

    const addListed = function (listing: Listing_2): void {
        if (listed === null) {
            setListed([listing]);
        } else {
            listed.push(listing);
            setListed(listed);
        }
    }

    const removeListed = function (token_id: bigint): void {
        if (listed === null) return;

        let items = listed.filter((x) => {
            return x.token_id !== token_id
        });

        setListed(items);
    }

    const setPage = function (page: number): void {
        return setListedPage(page);
    }

    const setShowSend = function (show: boolean): void {
        if (show && displayToken === null) return;

        setShowSendModal(show);
    }

    const setShowList = function (show: boolean): void {
        if (show && displayToken === null) return;

        setShowListModal(show);
    }

    const setShowPurchase = function (show: boolean): void {
        if (show && displayToken === null) return;

        setShowPurchaseModal(show);
    }

    const setShowTransfer = function (show: boolean): void {
        if (show && authContext.wallet === undefined) return;

        setShowTransferModal(show);
    }

    const setDisplayedToken = async function (id: bigint): Promise<void> {
        if (authContext.icpunk === undefined) return;

        setDisplayToken(id);
        setDisplayTokenData(null);

        try {
            let token = await authContext.icpunk?.data_of(id);
            setDisplayTokenData(token);

        } catch (e) {
            console.log(e.message);
        }
    }

    const loadUserTokens = async function (): Promise<void> {
        if (isLoading) return;

        if (authContext.icpunk === undefined) return;

        setLoading(true);

        try {
            let tokens = await authContext.icpunk?.user_tokens(authContext.principal as Principal);
            setUserTokens(tokens);
        } catch (e) {
            console.log(e.message);
        }
        setLoading(false);
    };

    const loadListedPage = async function (): Promise<void> {
        if (isLoading) return;

        if (authContext.icpunk === undefined) return;

        setLoading(true);

        try {
            let listed_count = await authContext.icpunk?.get_listed_count();
            setListedCount(listed_count);

            let pages = (Number(listed_count) / 10);

            if (Number(listed_count) % 10 > 0)
                pages = pages + 1;

            let calls: Promise<Listing_2[]>[] = [];
            for (var i = 0; i < pages; i++) {
                calls.push(authContext.icpunk?.get_listed(BigInt(i)));
            }

            let results = await Promise.all(calls);
            let tokens = results.flat();


            setListed(tokens);
        } catch (e) {
            console.log(e.message);
        }

        setLoading(false);
    };

    const loadDisplayToken = async function (): Promise<void> {
        if (displayToken === null) return;
        if (authContext.icpunk === undefined) return;

        try {
            let token = await authContext.icpunk?.data_of(displayToken.valueOf());
            if (displayToken === token.id) {
                setDisplayTokenData(token);
            }

        } catch (e) {
            console.log(e.message);
        }
    }

    //Load user tokens once wallet is connected
    //Load all marketplace listings
    useEffect(() => {
        loadUserTokens();
        loadListedPage();
    }, [authContext.icpunk]);

    // useEffect(() => {
    //     if (authContext.principal === undefined) return;

    //     let prin = getCanisterIds();
    //     // var request = new Request(prin.collect_url+'?id='+authContext.principal?.toString());
    //     // fetch(request).then(function(response) {
    //     //     // console.log(response);
    //     // });

    // }, [authContext.principal])

    //Sets up displayToken, disable it for now
    useEffect(() => {
        if (displayToken !== null && listed !== null) {
            let listing = listed.find(function (x) { return x.token_id === displayToken });

            setDisplayTokenListing(listing);
        }
    }, [displayToken, listed]);


    // useEffect(() => {
    //     loadDisplayToken();
    // }, [displayToken]);

    return {
        // remainingTokens,
        userTokens,
        displayToken,
        displayTokenData,
        displayTokenListing,
        sortingOrder,

        listed,
        listed_page,
        listed_count,

        showSendModal,
        showListModal,
        showPurchaseModal,
        showTransferModal,

        loadUserTokens,
        loadDisplayToken,

        listToken,
        delistToken,
        sendToken,
        purchaseToken,

        loadListedPage,
        setPage,
        setDisplayedToken,
        setSortingOrder,

        setShowSend,
        setShowList,
        setShowPurchase,
        setShowTransfer,

        addListed,
        removeListed,
        setDisplayTokenListing
    };
}

const stateContext = createContext<StateContext>(null!);

export function ProvideState({ children }) {
    const state = useProvideState();
    return <stateContext.Provider value={state}>{children}</stateContext.Provider>;
}

export const useLocalState = () => {
    return useContext(stateContext);
};
