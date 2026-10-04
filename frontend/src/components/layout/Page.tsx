import { Box } from "@mui/material";
import ContentContainer from "./ContentContainer";
import SideBar from "./SideBar";
import PlayerHeader from "./PlayerHeader";

const PageStyling = {
	display: "flex",
	margin: 0,
	padding: 0,
	width: "100%",
	height: "100%",
	overflow: "hidden",
	backgroundColor: "#0f1f22",
}

const Page: React.FC<{
	children?: React.ReactNode
}> = ({
	children
}) => {
	return (
		<Box sx={PageStyling}>
			<SideBar/>
			<ContentContainer>
                <PlayerHeader />
                {children}
            </ContentContainer>
		</Box>
	)
}

export default Page;