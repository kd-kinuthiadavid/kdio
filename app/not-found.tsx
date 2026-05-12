import ContentSurface from "@/components/shared/ContentSurface";

export default function NotFound() {
  return (
    <ContentSurface className="w-full min-w-0 max-w-[min(100%,clamp(20rem,88vw,40rem))]">
      <div className="flex flex-col gap-y-4 sm:gap-y-6">
        <h1 className="text-balance font-semibold text-4xl capitalize leading-tight sm:text-5xl">
          Page not found!
        </h1>
        <p className="font-normal text-base leading-relaxed sm:text-lg">
          The page you are looking for does not exist. Please consider navigating
          back to the home page or any of the other pages on this website. Thanks.
        </p>
      </div>
    </ContentSurface>
  );
}
