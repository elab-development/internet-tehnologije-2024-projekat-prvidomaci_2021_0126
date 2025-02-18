import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const { pathname } = useLocation(); // useLocation vraca trenutni URL i ostale props, ali uz {pathname} vraca samo taj prop
  const pathnames = pathname.split('/').filter((x) => x);
  let breadcrumbPath = '';

  return (
    <div className="breadcrumbs">
      {pathnames.length > 0 && <Link to="/">Home</Link>}

      {pathnames.map((name, index) => {
        breadcrumbPath += `/${name}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span key={breadcrumbPath}> / {name}</span>
        ) : (
          <Link to={breadcrumbPath} key={breadcrumbPath}>
            <span> / {name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;