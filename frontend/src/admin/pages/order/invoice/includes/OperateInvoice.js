import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { has_permission } from "../../../../../api/Auth";
import useInvoice from "../../../../query/invoiceQuery";

const { Search } = Input;


const OperateInvoice = ({ selectedRowKeys, setResetQuery, handleSearch }) => {
    const [selected, setSelected] = useState([]);

    const { trash: { mutateAsync, isLoading } } = useInvoice();

    useEffect(() => {
        let selected_ids = [];
        selectedRowKeys.map((item) => {
            selected_ids.push(item.id);
            return 0;
        });
        setSelected(selected_ids);
    }, [selectedRowKeys]);

    const processDelete = () => {
        Modal.confirm({
            title: "Are you sure ?",
            icon: <ExclamationCircleOutlined />,
            content: "Attention! Selected items will be deleted.",
            okText: "Ok, Delete",
            okType: "danger",
            onOk: () => {
                mutateAsync(
                    { selected },
                    {
                        onSuccess: () => {
                            setResetQuery(true);
                            setSelected([]);
                        },
                    }
                ).then((r) => console.log(r.data));
            },
            cancelText: "Cancel",
        });
    };

    const can_delete = has_permission('recent.order.delete');
    const hasSelected = selected.length > 0;

    return (
        <>
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                {
                    can_delete &&
                    <Button
                        type="danger"
                        onClick={processDelete}
                        disabled={!hasSelected}
                        loading={isLoading}
                        style={{ marginRight: 4 }}
                    >
                        Delete
                    </Button>
                }
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
                </span>
                <Search
                    placeholder="Search"
                    enterButton
                    onChange={e => handleSearch(e.target.value)}
                    onSearch={handleSearch}
                    style={{
                        width: 300,
                    }}
                />
            </div>
        </>
    );
};

export default OperateInvoice;
