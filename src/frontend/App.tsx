import '../index.css';

export function App() {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment');
      const data = await response.json();
      console.log('Payment response:', data);
    } catch (error) {
      console.error('Error fetching payment response:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <button
        className="cursor-pointer rounded bg-blue-500 px-2 py-1 font-bold text-white duration-150 hover:bg-blue-700"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
}

export default App;
