import React from 'react';
import { Modal, Button, message } from 'antd';
import { CreatePostForm } from './CreatePostForm';
import { API_ROOT, AUTH_HEADER, TOKEN_KEY, POS_KEY, LOC_SHAKE, TOPIC_FACE, TOPIC_AROUND } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    //modified
    handleOk = () => {
        this.form.validateFields((err, values) => {
            console.log(values);
            if (!err) {
                const token = localStorage.getItem(TOKEN_KEY);
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));

                const formData = new FormData();
                formData.set('lat', lat + (Math.random()*2-1)*LOC_SHAKE );
                formData.set('lon', lon + (Math.random()*2-1)*LOC_SHAKE );
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                this.setState({ confirmLoading: true });
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData,
                })
                    .then((response) => {
                        if (response.ok) {
                            return this.props.loadPosts()
                        }
                        throw new Error('Failed to create post.');
                    })
                    .then(() => {
                        this.setState({ visible: false, confirmLoading: false });
                        this.form.resetFields();
                        message.success('Post created successfully!');
                    })
                    .catch((e) => {
                        console.error(e);
                        message.error('Failed to create post.');
                        this.setState({ confirmLoading: false });
                    });
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    //modified
    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText='Create'
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }
}
