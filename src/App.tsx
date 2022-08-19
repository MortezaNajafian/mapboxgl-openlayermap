import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'ol/ol.css'
import s from './App.module.css';
import AppContent from "./components/appContainer/AppContent";



function App() {
    return (
        <div className={s.appContainer}>
            <AppContent />
        </div>
    )

}

export default App;
