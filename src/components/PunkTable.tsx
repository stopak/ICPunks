import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";
import ClaimButton from "./ClaimButton";
import PunkCard from "./PunkCard";
import SortOrder from "./SortOrder";

export default function PunkTable(props: any) {
    const state = useLocalState();
    const auth = useAuth();

    const [tokenList, setTokenList] = useState(<></>);

    useEffect(() => {
        if (state.listed !== null) {
            let tokens = <>
                {state.listed.map((token, id) =>
                    <PunkCard key={id} token={token} />
                )}
            </>
            setTokenList(tokens);
        }
    }, [state.listed]);

    if (auth.icpunk === undefined) {
        return (
            <Container className="mt-5 text-center" style={{ height: '700px' }}>
                <h1 style={{ marginTop: '200px', marginBottom: '100px' }}>In order to use marketplace connect your wallet</h1>
                <ClaimButton />
            </Container>
        )
    }

    return (<>
        <Container className="mt-5">
            <Row>
                <Col>
                    <SortOrder />
                </Col>
                <Col>
                    <span className="float-right">Total listed: {state.listed_count?.toString()}</span>
                </Col>
            </Row>
        </Container>
        <Container className="mb-5">
            <Row>
                <div className="col-sm col-xs-12 mx-auto">
                    {tokenList}
                </div>
            </Row>
        </Container></>
    );
}