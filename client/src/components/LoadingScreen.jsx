function LoadingScreen({ message = 'Loading secure workspace...' }) {
  return (
    <div className="auth-page-shell">
      <div className="auth-card auth-card-center">
        <div className="status-pill">Please wait</div>
        <h1>Preparing your session</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
