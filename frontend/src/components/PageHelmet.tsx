import { Helmet } from "react-helmet-async";

type PageHelmetProps = {
  title: string;
  description: string;
};

const PageHelmet = ({ title, description }: PageHelmetProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default PageHelmet;
