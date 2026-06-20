export default function LoadingSpinner({ loading }) {
  if (!loading) return null;
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
}
