import React, {useEffect, useState} from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, List } from 'antd';
import QuoteData from './Quote Data.txt';
const originData = [
    {
        "id": "q1-alpha-4c3e",
        "quoteName": "Quote #1",
        "itemName": "Brenton 7-Piece Patio Set",
        "itemDescription": "A luxurious 7-piece outdoor sectional set, perfect for patios and gardens. Includes all-weather wicker, plush cushions, and a durable aluminum frame. Seats up to 6 people comfortably and is designed for year-round outdoor use.",
        "quoteDate": "2025-09-15T00:00:00Z",
        "committedFlag": false,
        "supplier": { "name": "Apex Imports" },
        "fobPort": { "countryOfOrigin": "Vietnam" },
        "costing": {
            "firstCost": 1320.00,
            "componentMaterialCosting": [
                { "materialDescription": "Aluminum Frame", "costPerSellingUnit": 300.00 },
                { "materialDescription": "All-Weather Wicker", "costPerSellingUnit": 275.50 },
                { "materialDescription": "Cushions & Fabric", "costPerSellingUnit": 410.00 }
            ]
        },
        "clubCosting": { "retailPrice": 1999.99 }
    },
    {
        "id": "q2-beta-8a1b",
        "quoteName": "Quote #2",
        "itemName": "Halifax 4-Piece Conversation Set",
        "itemDescription": "This 4-piece conversation set creates a perfect outdoor gathering spot. It features two chairs, a loveseat, and a coffee table. The set is built with a rustproof aluminum frame and includes deep-seating cushions for maximum comfort.",
        "quoteDate": "2025-09-12T00:00:00Z",
        "committedFlag": true,
        "supplier": { "name": "Apex Imports" },
        "fobPort": { "countryOfOrigin": "Vietnam" },
        "costing": {
            "firstCost": 1625.50,
            "componentMaterialCosting": [
                { "materialDescription": "Aluminum Frame", "costPerSellingUnit": 450.00 },
                { "materialDescription": "Decorative Rope", "costPerSellingUnit": 420.25 },
                { "materialDescription": "Cushions & Fabric", "costPerSellingUnit": 415.00 }
            ]
        },
        "clubCosting": { "retailPrice": 2699.99 }
    },
    {
        "id": "q3-gamma-9f2d",
        "quoteName": "Quote #3",
        "itemName": "Avalon 4-Piece Set with Firepit",
        "itemDescription": "The Avalon collection brings warmth and style to your outdoor space. This set includes a sofa, two armchairs, and a stylish firepit table. The furniture is crafted from durable, lightweight aluminum, making it both sturdy and easy to arrange.",
        "quoteDate": "2025-09-10T00:00:00Z",
        "committedFlag": false,
        "supplier": { "name": "Global Furnishings Co." },
        "fobPort": { "countryOfOrigin": "China" },
        "costing": {
            "firstCost": 995.00,
            "componentMaterialCosting": [
                { "materialDescription": "Aluminum Frame", "costPerSellingUnit": 425.00 },
                { "materialDescription": "Steel Components", "costPerSellingUnit": 35.00 },
                { "materialDescription": "Cushions & Fabric", "costPerSelling_unit": 340.50 }
            ]
        },
        "clubCosting": { "retailPrice": 1999.99 }
    }
]
const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const TableComponent = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = record => record.key === editingKey;

    useEffect(() => {
        getData();
    }, [])

    const getData =  () => {
        const data = []
        originData.forEach((item) => {
            data.push({
                id: item.id,
                itemName: item.itemName,
                itemDescription: item.itemDescription,
                supplier: item.supplier.name,
                quoteDate: dateFormatter(item.quoteDate),
                firstCost: `$${item.costing.firstCost}`,
                retailPrice: `$${item.clubCosting.retailPrice}`,
                componentMaterialCosting: renderComponentMaterialCosting(item.costing.componentMaterialCosting),
            })
        })
        console.log(data)
        setData(data)
    }
    const renderComponentMaterialCosting = (record) => {
        const arrObj = []
        record.forEach((item) => {
            arrObj.push(
                {
                    materialDescription: item?.materialDescription,
                    costPerSellingUnit: item?.costPerSellingUnit
                }
            )
        })
        const divList = <List
        bordered
        dataSource={arrObj}
        renderItem={item => <List.Item>{
            `Material Description: ${item.materialDescription}, Cost PerSelling Unit: ${item.costPerSellingUnit}`
        }</List.Item>}
        />
        return divList
    }
    const dateFormatter = (value) => {
        const d = new Date(value)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // 月份 +1 并补 0
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const edit = record => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            editable: true,
        },
        {
            title: 'Item Description',
            dataIndex: 'itemDescription',
            editable: true,
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            editable: true,
        },
        {
            title: 'Quote Date',
            dataIndex: 'quoteDate',
            editable: true,
        },
        {
            title: 'First Cost',
            dataIndex: 'firstCost',
            editable: true,
        },
        {
            title: 'Retail Price',
            dataIndex: 'retailPrice',
            editable: true,
        },
        {
            title: 'Committed?',
            dataIndex: 'committed',
            editable: true,
        },
        {
            title: 'Action Buttion',
            dataIndex: 'actionButtion',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                expandable={{
                    expandedRowRender: record => <p style={{ margin: 0}}>{record.componentMaterialCosting}</p>,
                    // rowExpandable: record => record.name !== 'Not Expandable',
                }}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
            />
        </Form>
    );
};
export default TableComponent;
