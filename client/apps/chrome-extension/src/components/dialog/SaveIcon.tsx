const SaveIcon = ({ active }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 33 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.125 29.75H6.875C6.14565 29.75 5.44618 29.4515 4.93046 28.9201C4.41473 28.3888 4.125 27.6681 4.125 26.9167V7.08333C4.125 6.33189 4.41473 5.61122 4.93046 5.07986C5.44618 4.54851 6.14565 4.25 6.875 4.25H22L28.875 11.3333V26.9167C28.875 27.6681 28.5853 28.3888 28.0695 28.9201C27.5538 29.4515 26.8543 29.75 26.125 29.75Z"
      stroke={active ? "black" : "#C4C4C4"}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23.375 29.7498V18.4165H9.625V29.7498"
      stroke={active ? "black" : "#C4C4C4"}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.625 4.25V11.3333H20.625"
      stroke={active ? "black" : "#C4C4C4"}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export default SaveIcon
