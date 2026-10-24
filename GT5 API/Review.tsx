import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import "./review.css";
import { askAI } from "./client";
import type { ReviewRating } from "./types";

const ratingLabels: Record<ReviewRating, string> = {
  "needs-work": "Needs work",
  developing: "Developing",
  strong: "Strong",
  excellent: "Excellent",
};

export default function Review() {
  const [description, setDescription] = useState("");
  const [promptError, setPromptError] = useState("");
  const reviewMutation = useMutation({ mutationFn: askAI });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = description.trim();

    if (prompt.length < 20 || prompt.length > 2000) {
      setPromptError("Your description must be between 20 and 2000 characters after trimming.");
      return;
    }

    setPromptError("");
    reviewMutation.mutate(prompt);
  }

  return (
    <section className="review-page">
      <header className="review-header">
        <p className="eyebrow">Project feedback</p>
        <h1>Get an AI review of your project</h1>
        <p className="intro">
          Describe what your project does, who it helps, and any features you have built. You’ll get practical feedback
          on its strengths and next steps.
        </p>
      </header>

      <div className="review-layout">
        <form className="review-form form-panel" onSubmit={handleSubmit}>
          <div>
            <p className="panel-kicker">Your project</p>
            <h2>What have you built?</h2>
            <p className="form-note">Keep the description between 20 and 2000 characters after trimming.</p>
          </div>
          <div className="form-field">
            <label htmlFor="project-description">Project description</label>
            <textarea
              id="project-description"
              name="prompt"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setPromptError("");
                reviewMutation.reset();
              }}
              placeholder="Describe your project, its main features, and the problem it solves..."
              rows={8}
              required
              aria-describedby="description-count"
              aria-invalid={Boolean(promptError)}
            />
            <div className="review-field-meta">
              <span id="description-count">{description.trim().length} / 2000 characters</span>
              {promptError && <span className="auth-error" role="alert">{promptError}</span>}
            </div>
          </div>
          <button className="form-submit" type="submit" disabled={reviewMutation.isPending}>
            {reviewMutation.isPending ? "Reviewing your project..." : "Review my project"}
          </button>
          {reviewMutation.error && <p className="auth-error" role="alert">{reviewMutation.error.message}</p>}
        </form>

        <div className="review-results" aria-live="polite">
          {reviewMutation.isPending && (
            <div className="data-panel review-placeholder">
              <p className="panel-kicker">Review in progress</p>
              <h2>Putting together your feedback</h2>
              <p className="form-note">This usually takes a few seconds.</p>
            </div>
          )}
          {!reviewMutation.isPending && !reviewMutation.data && (
            <div className="data-panel review-placeholder">
              <p className="panel-kicker">Your feedback</p>
              <h2>A clearer next step starts here.</h2>
              <p className="form-note">Submit a project description to see your review and rating.</p>
            </div>
          )}
          {reviewMutation.data && (
            <article className="data-panel review-card">
              <div className="review-card__heading">
                <div>
                  <p className="panel-kicker">AI project review</p>
                  <h2>Review summary</h2>
                </div>
                <span className={`review-rating review-rating--${reviewMutation.data.rating}`}>
                  {ratingLabels[reviewMutation.data.rating]}
                </span>
              </div>
              <p className="review-summary">{reviewMutation.data.summary}</p>
              <section className="review-section">
                <h3>What’s working well</h3>
                <ul>
                  {reviewMutation.data.strengths.map((strength, index) => (
                    <li key={`${index}-${strength}`}>{strength}</li>
                  ))}
                </ul>
              </section>
              <section className="review-section">
                <h3>Ideas to improve</h3>
                <ul>
                  {reviewMutation.data.improvements.map((improvement, index) => (
                    <li key={`${index}-${improvement}`}>{improvement}</li>
                  ))}
                </ul>
              </section>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
