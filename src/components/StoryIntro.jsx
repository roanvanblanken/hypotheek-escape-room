import { useState } from "react";
import { storyScenes } from "../data/story";

function StoryIntro({ onComplete, onBack }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = storyScenes[sceneIndex];
  const isLast = sceneIndex === storyScenes.length - 1;

  function nextScene() {
    if (isLast) {
      onComplete();
      return;
    }

    setSceneIndex((current) => current + 1);
  }

  function previousScene() {
    if (sceneIndex === 0) {
      onBack();
      return;
    }

    setSceneIndex((current) => current - 1);
  }

  return (
    <main className="story-intro">
      <section className="story-frame">
        <div className="story-visual">
          <img src={scene.image} alt={scene.imageAlt} />
        </div>
        <div className="story-copy-panel">
          <div className="story-subtitles">
            <span>{scene.visualLabel}</span>
            <p>{scene.subtitle}</p>
          </div>
          <div className="story-controls">
            <button className="ghost-button" type="button" onClick={previousScene}>
              {sceneIndex === 0 ? "Terug naar startscherm" : "Terug"}
            </button>
            <div className="scene-dots" aria-label="Story voortgang">
              {storyScenes.map((item, index) => (
                <span className={index === sceneIndex ? "active" : ""} key={item.visualLabel} />
              ))}
            </div>
            <button className="primary-button" type="button" onClick={nextScene}>
              {isLast ? "Open dossier" : "Volgende stap"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StoryIntro;
