function Skeleton({

  className = "",

  type = "default"

}) {

  // CARD
  if (type === "card") {

    return (

      <div className={`bg-white rounded-2xl shadow p-5 animate-pulse ${className}`}>

        <div className="h-4 bg-gray-200 rounded w-28 mb-4" />

        <div className="h-8 bg-gray-300 rounded w-20" />

      </div>

    );
  }

  // TABLE ROW
  if (type === "table") {

    return (

      <div className={`bg-white rounded-xl border border-gray-100 p-4 animate-pulse ${className}`}>

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-xl bg-gray-200" />

          <div className="flex-1">

            <div className="h-4 bg-gray-200 rounded w-40 mb-3" />

            <div className="h-3 bg-gray-100 rounded w-28 mb-2" />

            <div className="h-3 bg-gray-100 rounded w-20" />

          </div>

        </div>

      </div>

    );
  }

  // ACTIVITY
  if (type === "activity") {

    return (

      <div className={`flex items-start gap-4 p-4 animate-pulse ${className}`}>

        <div className="w-12 h-12 rounded-2xl bg-gray-200" />

        <div className="flex-1">

          <div className="h-4 bg-gray-200 rounded w-40 mb-3" />

          <div className="h-3 bg-gray-100 rounded w-64 mb-2" />

          <div className="h-3 bg-gray-100 rounded w-24" />

        </div>

      </div>

    );
  }

  // PROFILE
  if (type === "profile") {

    return (

      <div className={`bg-white rounded-2xl shadow p-6 animate-pulse ${className}`}>

        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-5" />

        <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-3" />

        <div className="h-4 bg-gray-100 rounded w-52 mx-auto" />

      </div>

    );
  }

  // DEFAULT
  return (

    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />

  );
}

export default Skeleton;