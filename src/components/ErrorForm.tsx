interface ErrorFormProps {
  message?: string | null;
}

const ErrorForm: React.FC<ErrorFormProps> = ({ message }) => {
  if (!message) return null;

  const lines = message.split("\n");

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 rounded-md p-4 mb-4">
      <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorForm;
