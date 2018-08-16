type Summary = {
	/**
	 * The description of that web page
	 */
	description: string;

	/**
	 * The url of the icon of that web page
	 */
	icon: string;

	/**
	 * The name of site of that web page
	 */
	sitename: string;

	/**
	 * The url of the thumbnail of that web page
	 */
	thumbnail: string;

	/**
	 * The player of that web page
	 */
	player: Player;

	/**
	 * The title of that web page
	 */
	title: string;
};

export default Summary;

export type Player = {
	/**
	 * The url of the player
	 */
	url: string;

	/**
	 * The width of the player
	 */
	width: number;

	/**
	 * The height of the player
	 */
	height: number;
};
