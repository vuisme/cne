import {Table} from 'antd';
import React from 'react';


const fixedColumns = [
    {
        title: 'Date',
        dataIndex: 'created_at',
        fixed: true,
        width: 100,
    },
    {
        title: 'Description',
        dataIndex: 'description',
    },
    {
        title: 'Order Number',
        dataIndex: 'order_number',
    },
];
const fixedData = [];

for (let i = 0; i < 5; i += 1) {
    fixedData.push({
        key: i,
        created_at: ['Light', 'Bamboo', 'Little'][i % 3],
        order_number: '232323',
        description: 'this is the description',
    });
}

const CustomerOrders = () => {

    return (
        <>
            <Table
                columns={fixedColumns}
                dataSource={fixedData}
                pagination={false}
                scroll={{
                    x: 1200,
                    y: 500,
                }}
                bordered
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={2}>This is a summary content</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </>
    );
};

export default CustomerOrders;
