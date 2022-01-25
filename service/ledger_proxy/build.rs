use prost_build::Config;

extern crate prost_build;

fn main() {
    let mut config = Config::new();
    config.out_dir("gen");

    config.type_attribute(
        "ic_ledger.pb.v1.AccountIdentifier",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
            "#[cfg_attr(feature = \"test\", derive(comparable::Comparable))]",
        ]
        .join(" "),
    );

    config.type_attribute(
        "ic_ledger.pb.v1.Block",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
            "#[cfg_attr(feature = \"test\", derive(comparable::Comparable))]",
        ]
        .join(" "),
    );

    config.type_attribute(
        "ic_ledger.pb.v1.Transaction",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
            "#[cfg_attr(feature = \"test\", derive(comparable::Comparable))]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Transaction.transfer",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Send",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Mint",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Burn",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Tokens",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );
    config.type_attribute(
        "ic_ledger.pb.v1.Hash",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );

    config.type_attribute(
        "ic_ledger.pb.v1.BlockHeight",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );

    config.type_attribute(
        "ic_ledger.pb.v1.Memo",
        [
            "#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]",
        ]
        .join(" "),
    );

    config.type_attribute(
        "ic_ledger.pb.v1.TimeStamp",
        "#[derive(Eq, PartialOrd, Ord, Hash, Copy, candid::CandidType, serde::Deserialize, serde::Serialize)]",
    );

    config.compile_protos(&["pb/v1/types.proto"],
                                &["pb/"]).unwrap();
}