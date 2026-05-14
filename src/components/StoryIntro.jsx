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

  return (
    <main className="story-intro">
      <section className="story-frame">
        <div className={`story-visual scene-${sceneIndex + 1}`} role="img" aria-label={scene.imageAlt}>
          <span>{scene.visualLabel}</span>
        </div>
        <div className="story-subtitles">
          <p>{scene.subtitle}</p>
          {scene.optionalCaption && <span>{scene.optionalCaption}</span>}
        </div>
        <div className="story-controls">
          <button className="ghost-button" type="button" onClick={onBack}>
            Terug
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
      </section>
    </main>
  );
}

export default StoryIntro;
