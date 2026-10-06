'use client';

import { useEffect, useRef, useState } from 'react';

export default function CameraDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState('Camera is currently off.');

  async function startCamera() {
    if (!window.isSecureContext) {
      setStatus('Camera access requires an HTTPS website.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('This browser does not support camera access.');
      return;
    }
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(nextStream);
      if (videoRef.current) {
        videoRef.current.srcObject = nextStream;
      }
      setStatus('Camera is active. Permission was granted by you.');
    } catch {
      setStatus('Camera permission was denied or the camera is unavailable.');
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('Camera is currently off.');
  }

  useEffect(() => {
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  return (
    <main style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20,
      background: 'linear-gradient(135deg,#061a3a,#0b5ed7)', color: '#fff',
      fontFamily: 'Arial,sans-serif'
    }}>
      <section style={{
        width: 'min(680px,100%)', padding: 26, borderRadius: 24,
        background: '#ffffff18', border: '1px solid #ffffff35',
        textAlign: 'center', backdropFilter: 'blur(10px)'
      }}>
        <h1>STEM MATRIX AI SOLUTIONS</h1>
        <h2>AI Camera & Computer Vision Demo</h2>
        <p style={{lineHeight: 1.5}}>
          This educational demo requests camera access only after you tap
          <b> Start Camera</b> and choose <b>Allow</b>. Video is not uploaded or recorded.
        </p>
        <button onClick={startCamera} disabled={!!stream}
          style={{padding:'14px 24px',margin:6,border:0,borderRadius:999,fontWeight:700}}>
          📷 Start Camera
        </button>
        <button onClick={stopCamera} disabled={!stream}
          style={{padding:'14px 24px',margin:6,border:0,borderRadius:999,fontWeight:700}}>
          ⏹ Stop Camera
        </button>
        <video ref={videoRef} autoPlay playsInline muted
          style={{display: stream ? 'block' : 'none', width:'100%', maxHeight:'55vh',
          marginTop:16, borderRadius:18, background:'#000', objectFit:'cover'}} />
        <p>{status}</p>
        <small>Educational demonstration • STEM MATRIX AI SOLUTIONS</small>
      </section>
    </main>
  );
}
