"use client";
import { addUser, updateUser } from "@/redux/slices/usersSlice";
import { RootState } from "@/redux/store";
import {
	Autocomplete,
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid2,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Radio,
	RadioGroup,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

type Props = {};

const leagues = ["Laliga", "League 1", "League 2"];
const positions = ["Forward", "Backward", "Midfielder"];
const statuses = ["Active", "Retired"];

const CreateUser = (props: Props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const params = useSearchParams();
	const users = useSelector((state: RootState) => state.users);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			dob: "",
			leaguesPlayed: [],
			status: "",
			position: "",
			height: "",
		},
	});

	useEffect(() => {
		if (params.get("id")) {
			const data: any = users?.find((i) => i.id == params.get("id"));
			reset(data);
		}
	}, [params]);

	const onSubmit = (data: any) => {
		if (params.get("id")) {
			dispatch(updateUser({ ...data, id: params.get("id") }));
		} else {
			dispatch(
				addUser({
					...data,
					id: uuidv4(),
				})
			);
		}
		router.push("/user-management");
	};

	// Minimum valid date 5 years before today
	const minValidDate = new Date();
	minValidDate.setFullYear(minValidDate.getFullYear() - 5);

	return (
		<Stack spacing={4}>
			<Typography variant="h4" component="h2">
				User Information Form
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Grid2 container spacing={4}>
					<Grid2 size={6}>
						<Controller
							name="name"
							control={control}
							rules={{ required: "Name is required" }}
							render={({ field }) => (
								<FormControl fullWidth>
									<TextField
										{...field}
										variant="outlined"
										placeholder="Enter the name"
										fullWidth
										label="Name"
										error={!!errors.name}
									/>
									{errors.name && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.name.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>

					<Grid2 size={6}>
						<Controller
							name="dob"
							control={control}
							rules={{
								required: "Date of Birth is required",
								validate: (value) => {
									const selectedDate = new Date(value);
									if (selectedDate > minValidDate) {
										return "Date of Birth must be at least 5 years ago";
									}
									return true;
								},
							}}
							render={({ field }) => (
								<FormControl fullWidth>
									<TextField
										{...field}
										type="date"
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
										label="Date of Birth"
										error={!!errors.dob}
									/>
									{errors.dob && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.dob.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>
					<Grid2 size={6}>
						<Controller
							name="leaguesPlayed"
							rules={{ required: "Please select at least one league" }}
							control={control}
							render={({ field }) => (
								<FormControl fullWidth>
									<Autocomplete
										{...field}
										multiple
										options={leagues}
										onChange={(event, value) => field.onChange(value)}
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder="Select leagues"
												error={!!errors.leaguesPlayed}
												label="Leagues Played"
											/>
										)}
									/>
									{errors.leaguesPlayed && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.leaguesPlayed.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>
					<Grid2 size={6}>
						<Controller
							name="height"
							control={control}
							rules={{
								required: "Height is required",
								min: {
									value: 1,
									message: "Height cannot be less than 1 meter",
								},
								max: {
									value: 3,
									message: "Height cannot be more than 3 meter",
								},
							}}
							render={({ field }) => (
								<FormControl fullWidth>
									<InputLabel htmlFor="outlined-adornment-height">
										Height
									</InputLabel>
									<OutlinedInput
										{...field}
										endAdornment={
											<InputAdornment position="end">Meter</InputAdornment>
										}
										id="outlined-adornment-height"
										placeholder="Enter the height"
										fullWidth
										label="Height"
										type="number"
										error={!!errors.height}
									/>
									{errors.height && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.height.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>
					<Grid2 size={6}>
						<Controller
							name="status"
							control={control}
							rules={{ required: "Status is required" }}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.status}>
									<InputLabel id="status-label">Status</InputLabel>
									<Select
										{...field}
										labelId="status-label"
										input={<OutlinedInput label="Status" />}
										renderValue={(selected) =>
											selected ? selected : "Select a status"
										}
									>
										{statuses.map((status) => (
											<MenuItem key={status} value={status}>
												<Radio
													checked={field.value === status}
													value={status}
													onClick={() => field.onChange(status)}
												/>
												{status}
											</MenuItem>
										))}
									</Select>
									{errors.status && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.status.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>
					<Grid2 size={6}>
						<Controller
							name="position"
							control={control}
							rules={{ required: "Position is required" }}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.position}>
									<InputLabel id="position-label">Position</InputLabel>
									<Select
										{...field}
										label="Position"
										labelId="position-label"
										renderValue={(selected) =>
											selected ? selected : "Select a position"
										}
									>
										{positions.map((pos) => (
											<MenuItem key={pos} value={pos}>
												<FormControlLabel
													value={pos}
													control={<Radio checked={field.value === pos} />}
													label={pos}
												/>
											</MenuItem>
										))}
									</Select>
									{errors.position && (
										<Typography
											variant="body2"
											style={{ marginTop: "5px" }}
											color="error"
										>
											{errors.position.message}
										</Typography>
									)}
								</FormControl>
							)}
						/>
					</Grid2>

					<Grid2 size={12}>
						<Button type="submit" variant="contained" color="primary">
							{params.get("id") ? "Update" : "Submit"}
						</Button>
					</Grid2>
				</Grid2>
			</form>
		</Stack>
	);
};

export default CreateUser;