import {InfoCircleOutlined} from '@ant-design/icons';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, InputNumber, Space} from 'antd';
import React from 'react';

const PriceForm2 = () => {
    const onFinish = (values) => {
        console.log('Received values of form:', values);
    };

    return (
        <Form name="dynamic_form_nest_item"
              layout='vertical' onFinish={onFinish} autoComplete="off">
            <Form.List name="ali_pricing_conversion">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    label={'Minimum'}
                                    name={[name, 'minimum']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing minimum number',
                                        },
                                    ]}
                                >
                                    <InputNumber style={{width: '100%'}} min={0}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label={'Maximum'}
                                    name={[name, 'maximum']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing maximum number',
                                        },
                                    ]}
                                >
                                    <InputNumber style={{width: '100%'}} min={0}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label={'Rate'}
                                    name={[name, 'rate']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing rate name',
                                        },
                                    ]}
                                >
                                    <InputNumber style={{width: '100%'}} min={0}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PriceForm2;
