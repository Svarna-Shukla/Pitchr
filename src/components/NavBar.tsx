import Logo from "./Logo";

// Fixed glassmorphism navigation bar hosting the logo
export default function NavBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-30 flex items-center border-b border-white/10 bg-white/5 px-8 py-3 backdrop-blur-xl">
      <Logo />
    </div>
  );
}
