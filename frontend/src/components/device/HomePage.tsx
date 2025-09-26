import Device from './Device';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Real-time Device Status</h1>
      <Device />
    </div>
  );
}