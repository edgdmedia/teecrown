import { packages as staticPackages } from "@/data/packages";
import { getTourPackages } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { TourDetailContent } from "./page-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const packages = await getTourPackages().catch(() => staticPackages);
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const allPkgs = await getTourPackages();
  const pkg = allPkgs.find((p) => p.slug === slug);

  if (!pkg) {
    return (
      <div>
          <div style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
            <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
              <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '28px', fontWeight: 700 }}>Tour not found</h1>
              <p style={{ color: 'var(--color-text)', marginTop: '8px' }}>The package you&apos;re looking for doesn&apos;t exist.</p>
              <Button variant="outline" href="/tours" style={{ marginTop: '24px' }}>Back to tours</Button>
            </div>
          </div>
      </div>
    );
  }

  return <TourDetailContent pkg={pkg} allPackages={allPkgs} />;
}
