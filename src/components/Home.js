import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY} from '../constants'
import {Gallery} from "./Gallery"

const { TabPane } = Tabs;

export class Home extends React.Component{

    state = {
        isLoadingGeoLocation: false,
        error: '',
        posts:[],
        isLoadingPosts:false
    }

    componentDidMount(){
        if ("geolocation" in navigator) {
            this.setState({isLoadingGeoLocation: true, error: "", posts:[], isLoadingPosts:true})
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLodGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            )
        } else {
            this.setState({error: "GeoLocation is not supported"})
        }
    }

    onSuccessLodGeoLocation = (position) => {
        const {latitude, longitude} = position.coords
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}))
        this.setState({isLoadingGeoLocation: false, error: ""})
        this.loadNearbyPosts()
    }

    onFailedLoadGeoLocation = ()=>{
        this.setState({isLoadingGeoLocation: false, error: "failed to load geo location"})
    }

    loadNearbyPosts = ()=>{
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY))
        const token = localStorage.getItem(TOKEN_KEY)
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,{
            method:'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response)=>{
                // console.log(response)
                if(response.ok){
                    return response.json();
                }else{
                    throw new Error('Failed to load posts')
                }
            })
            .then((data)=>{
                // console.log()
                this.setState({posts: data?data:[], isLoadingPosts: false})
            })
            .catch((e)=>{
                console.error(e);
                this.setState({isLoadingPosts:false, error: e.message})
            })
    }

    renderImagePosts =()=>{
        const {isLoadingGeoLocation, error, isLoadingPosts, posts} = this.state;
        if(error){
            return error
        }else if(isLoadingGeoLocation){
            return <Spin tip="Loading GeoLocation"/>
        }else if(isLoadingPosts){
            return <Spin tip="Loading Posts"/>
        }else if(posts.length > 0){
            const images= posts.map((post)=>({
                user:post.user,
                src: post.url,
                thumbnail: post.url,
                captoin:post.message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            }));
            return <Gallery images={images}/>
        }else{
            return "No Nearby Posts"
        }
    }

    render(){
        const operations = <Button type={"primary"}>Create New Post</Button>;
        // const {isLoadingGeoLocation, error} = this.state;
        return(
            <Tabs tabBarExtraContent={operations} className = "main-tabs">
                <TabPane tab="Image Posts" key="1">
                    {this.renderImagePosts()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    Content of tab 2
                </TabPane>
                <TabPane tab="Map" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        )
    }
}