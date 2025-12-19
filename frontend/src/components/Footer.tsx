export default function Footer() {
  return (
    <footer className="border-t mt-10 py-4 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} Anshuman • Collaborative Task Manager
      </p>
    </footer>
  );
}
