/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qgGZRBhAc4p
 */
import { CardTitle, CardHeader, CardContent, Card } from 'components/ui/card'
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from 'components/ui/table'
import { AvatarImage, Avatar } from 'components/ui/avatar'

export default function LeaderBoardTable(props) {
    console.log(props.users)

    return (
        <div className="p-4 md:px-5 lg:px-20 md:pt-3 lg:pt-5">
            <Card className="overflow-y-auto border-none lg:w-9/12 text-white mx-auto">
                <CardHeader className="p-4 bg-gray-800">
                    <CardTitle className="text-lg font-semibold text-white">
                        Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="text-white">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">
                                    Username
                                </TableHead>
                                <TableHead className="w-1/2 text-right">
                                    Points
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.users.map((user, index)=>{
                            return <TableRow key={user.mint_address} className="hover:bg-gray-700 transition-colors duration-200">
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                alt="User 1"
                                                src={user.pfp_url}
                                            />
                                        </Avatar>
                                        <span>
                                            {index + 1}. {user.domain}.shaga
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                            {user.points}
                                </TableCell>
                            </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
