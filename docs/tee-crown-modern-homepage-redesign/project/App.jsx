// Home page assembly — transparent header over hero, shared chrome.
function App() {
  const [scrolled, setScrolled] = React.useState(false);
  const [contact, setContact] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const openContact = () => setContact(true);
  return (
    <>
      <Header current="Home" scrolled={scrolled} onContact={openContact} />
      <main>
        <Hero onContact={openContact} onExplore={() => { const el = document.querySelector('#tours'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' }); }} />
        <StatsBand />
        <ServicesSection onContact={openContact} />
        <StepsSection />
        <ToursSection onContact={openContact} />
        <WhySection />
        <TestimonialsBand />
        <StoriesSection />
        <BigCTA onContact={openContact} />
      </main>
      <Footer onContact={openContact} />
      <WhatsAppFab />
      <ContactDrawer open={contact} onClose={() => setContact(false)} />
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
