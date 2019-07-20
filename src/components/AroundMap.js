import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";
import {AroundMarker} from "./AroundMarker";
import {POS_KEY, TOPIC_AROUND, TOPIC_FACE} from "../constants";


class NormalAroundMap extends React.Component{

    reloadMarker=()=>{
        const center = this.getCenter()
        const radius = this.getRadius()
        this.props.loadPosts(center, radius)

    }

    getCenter(){
        const center = this.map.getCenter();
        return {lat: center.lat(), lon: center.lng()}
    }

    getMapRef=(mapInstance)=>{
        this.map=mapInstance;
    }

    getRadius(){
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }


    render(){
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        return(
            <div>
                <GoogleMap ref={this.getMapRef}
                    defaultZoom={8}
                    defaultCenter={{lat, lng:lon}}
                    onDragEnd={this.reloadMarker}
                    onZoomChanged={this.reloadMarker}
                >
                    {this.props.posts.map((post)=>(
                        <AroundMarker key={post.url} post={post}>
                        </AroundMarker>
                    ))}
                </GoogleMap>
            </div>
        )
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap))