export default function NotFound() {
  return (
    <div className="flex flex-col gap-y-6 max-w-[70%] 2xl:max-w-[50%]">
      <h1 className="font-semibold text-5xl capitalize">Page not found!</h1>
      <p className={`font-normal text-lg`}>
        The page you are looking for does not exist. Please consider navigating
        back to the home page or any of the other pages on this website. Thanks.
      </p>
    </div>
  );
}
