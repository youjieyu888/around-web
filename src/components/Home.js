import React from 'react';
import { Tabs, Spin, Row, Col } from 'antd';
import {
    GEO_OPTIONS,
    POS_KEY,
    API_ROOT,
    AUTH_HEADER,
    TOKEN_KEY,
    POST_TYPE_IMAGE,
    POST_TYPE_VIDEO,
    POST_TYPE_UNKNOWN,
} from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import {AroundMap} from "./AroundMap";

const { TabPane } = Tabs;

export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: '',
        posts: [],
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({ isLoadingGeoLocation: true, error: '' });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ error: 'Geolocation is not supported.'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        this.setState({ isLoadingGeoLocation: false, error: '' });
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        this.setState({ isLoadingGeoLocation: false, error: 'Failed to load geo location.' });
    }

    loadNearbyPosts = (center, radius) => {
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius?radius:20
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: '' });
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${radius}`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load post.');
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data ? data : [], isLoadingPosts: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoadingPosts: false, error: e.message });
            });
    }

    renderImagePosts() {
        const { posts } = this.state;
        const images = posts
            .filter((post) => post.type === POST_TYPE_IMAGE)
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                };
            });
        return <Gallery images={images}/>
    }

    renderVideoPosts() {
        const { posts } = this.state;
        return (
            <Row gutter={30}>
                {
                    posts
                        .filter((post) => [POST_TYPE_VIDEO, POST_TYPE_UNKNOWN].includes(post.type))
                        .map((post) => (
                            <Col span={6} key={post.url}>
                                <video src={post.url} controls={true} className="video-block"/>
                                <p>{post.user}: {post.message}</p>
                            </Col>
                        ))
                }
            </Row>
        );
    }

    renderPosts(type) {
        const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..."/>
        } else if (posts.length > 0) {
            return type === POST_TYPE_IMAGE ? this.renderImagePosts() : this.renderVideoPosts();
        } else {
            return 'No nearby posts';
        }
    }

    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Posts" key="1">
                    {this.renderPosts(POST_TYPE_IMAGE)}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.renderPosts(POST_TYPE_VIDEO)}
                </TabPane>
                <TabPane tab="Map" key="3">
                    <AroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6H9bJcyRzUYM3rc1DVGUu80ASLnoUkCc&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
