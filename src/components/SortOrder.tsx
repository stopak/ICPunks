import { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useLocalState } from "src/utils/state";


export default function SortOrder() {
    const state = useLocalState();
    const [orderTitle, setOrderTitle] = useState("Low to High");

    useEffect(() => {
        if (state.sortingOrder) {
            setOrderTitle("Low to High");
        } else {
            setOrderTitle("High to Low");
        }
    }, [state.sortingOrder]);

    function updateSortOrder(sortOrder) {
        state.setSortingOrder(sortOrder);
    }

    return (
    <div>
        <span className="inline_spans">
            <DropdownButton id="dropdown-basic-button" title={orderTitle}>
                <Dropdown.Item onClick={() => updateSortOrder(true)} >Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => updateSortOrder(false)} >High to Low</Dropdown.Item>
            </DropdownButton>
        </span>

    </div>

    );
}