import axios from 'axios';
import '../index.css';

export function App() {
  const handlePayment = async () => {
    try {
      const { data } = await axios.post('/api/payment');

      const a = document.createElement('a');
      a.href = data.result.checkoutUrl;

      a.click();
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
