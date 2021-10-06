const DFX_NETWORK = process.env.REACT_APP_DFX_NETWORK || "ic";

export function getCanisterIds() {

    if (DFX_NETWORK === 'ic') {
        return {
            icpunks: "qcg3w-tyaaa-aaaah-qakea-cai",
            storage: "qfh5c-6aaaa-aaaah-qakeq-cai",
            claim: "3hdbp-uiaaa-aaaah-qau4q-cai",
            ledger: "ryjl3-tyaaa-aaaaa-aaaba-cai",

            icpunks_wallet: "hkqch-cbhw4-zszvz-b2vgn-5apok-bni6c-txgrx-2nsrf-4n5rb-xjrn6-qqe",

            token_img: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app",
            collect_url: "https://icpunks.com/collect",

            get_img: function(url: string|undefined) { return this.token_img+url; }
        }
    }
    return {
        icpunks: "rwlgt-iiaaa-aaaaa-aaaaa-cai",
        storage: "rrkah-fqaaa-aaaaa-aaaaq-cai",
        claim: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        ledger: "ryjl3-tyaaa-aaaaa-aaaba-cai",

        icpunks_wallet: "hkqch-cbhw4-zszvz-b2vgn-5apok-bni6c-txgrx-2nsrf-4n5rb-xjrn6-qqe",

        token_img: "http://rwlgt-iiaaa-aaaaa-aaaaa-cai.localhost:8000",
        collect_url: "http://localhost:3050/collect",

        get_img: function(url: string|undefined) { return this.token_img+url; }
    }
}

