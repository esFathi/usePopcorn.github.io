const ResultsNumber = ({ movies }) => {
  const number = movies.length;

  return (
    <p className='num-results'>
      Found <strong>{number}</strong> results
    </p>
  );
};

export default ResultsNumber;
