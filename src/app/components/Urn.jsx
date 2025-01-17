"use client"
import "./Urn.sass";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three";
import { useSpring } from "@react-spring/three";
import * as THREE from "three";

const urns = [
    {
        objSrc: "bottles/1.obj",
        scale: 12
    },
    {
        objSrc: "bottles/CAN-001.obj",
        scale: 5
    },
    {
        objSrc: "bottles/round-can-001.obj",
        scale: 10
    },
    {
        objSrc: "bottles/round-jar-001.obj",
        scale: 7.5
    },
    {
        objSrc: "bottles/wine-bottle-007.obj",
        scale: 3
    }
]

export default function Urn({ objIndex, textureSrc })
{
    const meshRef = useRef();
    const obj = useLoader(OBJLoader, urns[objIndex].objSrc);
    const texture = useLoader(TextureLoader, textureSrc);
    obj.traverse((child) => {
        if(child.isMesh)
        {
            child.material = new THREE.MeshStandardMaterial({map: texture});
        }
    });
    const [ hover, setHover ] = useState(false);
    return (
        <div className="urn-3d">
            <Canvas
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <ambientLight intensity={Math.PI / 2} />
                <mesh
                    ref={meshRef}
                    scale={1}>
                    <primitive object={obj} scale={urns[objIndex].scale} position={[0, -0.4, 0]} />
                </mesh>
                <CameraContrls hover={hover} />
            </Canvas>
        </div>
    );
}

function CameraContrls({ hover })
{
    const { polarAngle } = useSpring({
        polarAngle: hover ? 2 * Math.PI / 8 : 3 * Math.PI / 8,
        config: {
            tension: 280,
            friction: 60
        }
    });
    console.log(polarAngle.get());
    const { camera, gl, scene } = useThree();
    const controlRef = useRef();
    useEffect(() => {
        const radius = 1;
        camera.position.set(
            radius * Math.sin(polarAngle.get()),
            radius * Math.cos(polarAngle.get()),
            0
        );
        if(controlRef.current)
        {
            controlRef.current.update();
        }
    }, [camera, polarAngle]);


    return <OrbitControls
        ref={controlRef}
        args={[camera, gl.domElement]}
        minPolarAngle={2 * Math.PI / 8}
        maxPolarAngle={3 * Math.PI / 8}
        enableZoom={false}
        enablePan={false}
    />;
}