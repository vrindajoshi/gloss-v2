import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function NewsWebsite() {
  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Header/Navigation */}
      <header className="bg-neutral-900 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">The Daily Chronicle</h1>
            <nav className="flex gap-6 text-sm">
              <a href="#" className="hover:text-neutral-300">Home</a>
              <a href="#" className="hover:text-neutral-300">World</a>
              <a href="#" className="hover:text-neutral-300">Politics</a>
              <a href="#" className="hover:text-neutral-300">Business</a>
              <a href="#" className="hover:text-neutral-300">Science</a>
            </nav>
          </div>
        </div>
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full max-w-md px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Article */}
        <article className="mb-12">
          <div className="relative h-96 mb-6 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1611244763972-aa9c8368ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjBoZWFkbGluZXxlbnwxfHx8fDE3Njk4MzMyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Breaking news"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Breaking News</span>
          <h2 className="text-4xl font-bold text-neutral-900 mt-2 mb-4">
            Understanding Cellular Biology: The Power Plants of Life
          </h2>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-6">
            <span>By Sarah Johnson</span>
            <span>•</span>
            <span>January 31, 2026</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
          <div className="prose max-w-none text-neutral-800 space-y-4">
            <p className="text-lg leading-relaxed">
              The mitochondrion is a membrane-bound organelle found in the cytoplasm of eukaryotic cells. It is responsible for generating adenosine triphosphate (ATP), which serves as the primary energy currency of the cell through a process called cellular respiration. The structure of mitochondria is characterized by a double membrane system: an outer membrane that is relatively permeable and an inner membrane that is highly folded into structures called cristae, which significantly increase the surface area available for ATP synthesis.
            </p>
            <p className="leading-relaxed">
              The evolutionary origin of mitochondria is explained by the endosymbiotic theory, which posits that these organelles descended from free-living prokaryotic organisms that were engulfed by ancestral eukaryotic cells approximately 1.5 billion years ago. This symbiotic relationship proved mutually beneficial, as the host cell provided protection and nutrients while the engulfed prokaryote provided enhanced energy production capabilities.
            </p>
            <p className="leading-relaxed">
              Mitochondria possess their own circular DNA (mtDNA), which is distinct from the nuclear DNA found in the cell's nucleus. This mitochondrial genome encodes for some of the proteins necessary for mitochondrial function, while the majority of mitochondrial proteins are encoded by nuclear genes and imported into the organelle. The presence of their own genetic material and ribosomes supports the endosymbiotic theory of their origin.
            </p>
            <p className="leading-relaxed">
              Dysfunction in mitochondrial processes can lead to various pathological conditions collectively known as mitochondrial diseases. These disorders can affect multiple organ systems, particularly those with high energy demands such as the brain, heart, and muscles. Common symptoms include muscle weakness, neurological problems, and metabolic abnormalities. Understanding mitochondrial biology is crucial for developing therapeutic interventions for these conditions.
            </p>
          </div>
        </article>

        {/* More Articles */}
        <div className="grid md:grid-cols-3 gap-8 border-t border-neutral-200 pt-8">
          <article>
            <div className="h-48 bg-neutral-200 rounded-lg mb-4 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763758298936-f6610008043e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBhcnRpY2xlJTIwdGV4dHxlbnwxfHx8fDE3Njk4MzMyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Article"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-neutral-500 uppercase">Technology</span>
            <h3 className="text-xl font-bold text-neutral-900 mt-2 mb-2">
              New Advances in Quantum Computing
            </h3>
            <p className="text-sm text-neutral-600">
              Researchers announce breakthrough in quantum error correction...
            </p>
          </article>

          <article>
            <div className="h-48 bg-neutral-200 rounded-lg mb-4 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523120974498-9d764390d8e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2OTgzMzI1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Article"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-neutral-500 uppercase">World</span>
            <h3 className="text-xl font-bold text-neutral-900 mt-2 mb-2">
              Climate Summit Reaches Historic Agreement
            </h3>
            <p className="text-sm text-neutral-600">
              Global leaders commit to ambitious carbon reduction targets...
            </p>
          </article>

          <article>
            <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
            <span className="text-xs font-semibold text-neutral-500 uppercase">Health</span>
            <h3 className="text-xl font-bold text-neutral-900 mt-2 mb-2">
              Revolutionary Gene Therapy Shows Promise
            </h3>
            <p className="text-sm text-neutral-600">
              Clinical trials demonstrate effectiveness in treating rare disorders...
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}
