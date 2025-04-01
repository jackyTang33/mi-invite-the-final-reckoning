import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';

function App() {
  const [countdown, setCountdown] = useState(false);
  // count down timer
  const [timer, setTimer] = useState(3000);
  const [redirectURL, setRedirectURL] = useState(null);
  const [isAnimating, setAnimating] = useState(false);
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    let interval;
    console.log("useEffect Triggered")
    if (countdown && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 10);
      }, 1);
    } else if (countdown && timer <= 0) {
      clearInterval(interval);
      explode();
      
    }
    return () => {
      clearInterval(interval)
    };
  }, [countdown, timer]);

  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  function handleAccept() {
    setCountdown(true);
    setTimer(timer);
    setRedirectURL("https://google.com");
  }

  function handleTrailer(){
    setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=NOhDyUmT9z0";
    }, 100); 
  }
  
  function explode() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    class Particle {
      constructor(angle, centerX, centerY) {
        this.x = centerX;
        this.y = centerY;
        this.angle = angle;
        this.speed = 10 + Math.random() * 30;
        this.radius = 5 + 10;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = `rgba(255, ${Math.random() * 100}, 0, `;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.98;
        this.radius *= 0.95;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }
  
    class Explosion {
      constructor(width, height) {
        this.particles = [];
        this.centerX = width / 2;
        this.centerY = height / 2;
        for (let i = 0; i < 600; i++) {
          this.particles.push(new Particle(Math.random() * Math.PI * 2, this.centerX, this.centerY));
        }
      }
      update(ctx) {
        this.particles = this.particles.filter((p) => p.alpha > 0.01);
        this.particles.forEach((p) => {
          p.update();
          p.draw(ctx);
        });
      }
    }
  
    const explosion = new Explosion(canvas.width, canvas.height);
  
    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      explosion.update(ctx);
  
      if (explosion.particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        console.log("Reached redirection")
        // Ensure an immediate redirect once animation is fully done
        setTimeout(() => {
          window.location.href = redirectURL;
        }, 100); // Small delay to ensure smooth transition
  
        // Hide explosion canvas & countdown
        setCountdown(false);
        setTimer(3000);
      }
    }
  
    animate();
  }
  

  return (
    <div className={styles.Body}>
      {countdown && (
        <>
        <div ref={countdownRef} className={styles.CountDown}>
          <div className={styles.BombTimer}>{formatTime(timer)}</div>
          <p style={{fontSize :'20px'}}>On the way to MeetUp Point</p>
        </div>
        
        </>
      )}
      <canvas ref={canvasRef} className={styles.ExplosionCanvas}></canvas>
      
      <div className={styles.LeftDiv}>
        <h1 className={styles.Title1}>MOVIE NIGHT</h1>
        <h2 className={styles.Title2}>Mission: Impossible - The Final Reckoning</h2>
        <p className={styles.SelfDestruct}>🔴 THIS MESSAGE WILL SELF-DESTRUCT...</p>
        <p>Your next mission, should you choose to accept it:</p>
        <p className={styles.Points}><strong>Date:</strong> 22nd May 2025</p>
        <p className={styles.Points}><strong>Time:</strong> 20:00</p>
        <p className={styles.Points}><strong>Location:</strong> Sunway Velocity Mall</p>
        <p className={styles.Points}><strong>Extraction Points:</strong> MRT Maluri/MRT Cochrane</p>
        <p className={styles.Objective}>Your objective: Infiltrate the cinema, rendezvous with fellow agents, and immerse yourself in an action-packed night. Intel confirms that popcorn and drinks will be provided—no need to smuggle in supplies.</p>
        <p>📄 Your briefing (trailer) is just one click away.</p>
        <div className={styles.Buttons}>
          <button className={styles.AcceptButton} onClick={handleAccept}>Accept</button>
          <button className={styles.BriefingButton} onClick={handleTrailer}>Briefing</button>
        </div>
      </div>
      <div className={styles.RightDiv}>
        <img src='/main-pic.png' alt='Movie Poster' className={styles.Img}/>
      </div>
    </div>
  );
}

export default App;
