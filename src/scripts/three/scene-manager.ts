import * as THREE from 'three';

export class SceneManager {
    private static _instance: SceneManager | null = null;

    private _scenes: THREE.Scene[] = [];

    private constructor(){};

    public static GetInstance(): SceneManager {
        if(this._instance === null) {
            this._instance = new SceneManager();
        }

        return this._instance;
    }

    public CreateScene(): THREE.Scene {
        const scene = new THREE.Scene();
        this._scenes.push(scene)
        return scene;
    }
}